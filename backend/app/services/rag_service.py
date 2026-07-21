import os
import uuid
import json
import re
from typing import List, Dict, Any, Optional
from app.db.user_store import user_store

class RAGService:
    """
    Service de Retrieval-Augmented Generation (RAG) Avancé.
    Gère le découpage par section, l'auto-tagging sémantique et la recherche pondérée.
    """

    def ingest_document(self, user_id: str, file_name: str, content: str, brain_type: str = "Company Brain") -> str:
        """
        Indexe un document avec analyse structurelle et marquage sémantique.
        """
        doc_id = f"doc-{uuid.uuid4().hex[:8]}"

        # 1. Découpage intelligent par sections/paragraphes
        sections = self._split_into_sections(content)

        # 2. Raffinement des chunks et auto-tagging
        all_chunks = []
        for section in sections:
            # Si une section est trop grande, on la recoupe
            if len(section) > 800:
                sub_chunks = self._chunk_text(section, size=600)
            else:
                sub_chunks = [section]

            for chunk_text in sub_chunks:
                tag = self._auto_tag_chunk(chunk_text)
                all_chunks.append({
                    "text": chunk_text,
                    "tag": tag
                })

        indexed_doc = {
            "id": doc_id,
            "name": file_name,
            "brain_type": brain_type,
            "status": "indexed",
            "chunks_count": len(all_chunks),
            "timestamp": "À l'instant"
        }

        # 3. Sauvegarde persistante
        user_data = user_store.get_or_create_user_data(user_id)
        knowledge = user_data.get("document_knowledge", [])

        for idx, chunk_data in enumerate(all_chunks):
            knowledge.append({
                "doc_id": doc_id,
                "chunk_id": f"{doc_id}-{idx}",
                "brain_type": brain_type,
                "content": chunk_data["text"],
                "tag": chunk_data["tag"],
                "metadata": {
                    "source": file_name,
                    "type": chunk_data["tag"]
                }
            })

        user_store.save_user_field(user_id, "document_knowledge", knowledge)

        sources = user_data.get("ingested_sources", [])
        sources.append(indexed_doc)
        user_store.save_user_field(user_id, "ingested_sources", sources)

        return doc_id

    def query_context(self, user_id: str, query: str, brain_types: List[str] = None) -> str:
        """
        Recherche de contexte avec pondération par Tags sémantiques.
        """
        user_data = user_store.get_or_create_user_data(user_id)
        knowledge = user_data.get("document_knowledge", [])

        if not knowledge:
            return ""

        # Détection de l'intention de la requête
        query_intent = self._auto_tag_chunk(query)

        relevant_chunks = knowledge
        if brain_types:
            relevant_chunks = [c for c in knowledge if c["brain_type"] in brain_types]

        query_words = set(query.lower().split())
        scored_chunks = []

        for chunk in relevant_chunks:
            chunk_content = chunk["content"].lower()
            chunk_tag = chunk.get("tag", "GENERAL")

            # Score de base par mots-clés
            match_score = sum(2 for word in query_words if word in chunk_content)

            # Bonus de pertinence par Tag (ex: si on cherche un prix et que le chunk est tagué PRICE)
            if chunk_tag == query_intent and query_intent != "GENERAL":
                match_score += 10

            if match_score > 0:
                scored_chunks.append((match_score, chunk))

        # Tri et formatage
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        top_context = []
        for _, chunk in scored_chunks[:4]:
            source_info = f"[SOURCE: {chunk['metadata']['source']} | TYPE: {chunk['tag']}]"
            top_context.append(f"{source_info}\n{chunk['content']}")

        if not top_context:
            return ""

        return "\n\n--- CONTEXTE EXTRAIT DES DOCUMENTS (ANALYSE MULTI-INFOS) ---\n" + "\n\n".join(top_context)

    def _split_into_sections(self, text: str) -> List[str]:
        """Découpe le texte selon les sauts de ligne doubles ou les titres probables."""
        # Split par double retour à la ligne (paragraphes)
        sections = re.split(r'\n\s*\n', text)
        return [s.strip() for s in sections if s.strip()]

    def _chunk_text(self, text: str, size: int = 500) -> List[str]:
        return [text[i:i+size] for i in range(0, len(text), size)]

    def _auto_tag_chunk(self, text: str) -> str:
        """Analyse heuristique pour taguer le type d'information."""
        t = text.lower()

        # Détection PRIX / CHIFFRES
        if any(char in t for char in ['€', '$', '£', 'fcfa']) or re.search(r'\d+[\.,]\d{2}', t):
            if any(word in t for word in ['tarif', 'prix', 'devis', 'coût', 'facture', 'montant']):
                return "PRICE"

        # Détection VISION / FONDATION
        if any(word in t for word in ['vision', 'mission', 'ambition', 'adn', 'valeurs', 'stratégie', 'fondateur']):
            return "VISION"

        # Détection RÈGLES / PROCESS
        if any(word in t for word in ['doit', 'obligatoire', 'règle', 'process', 'étape', 'condition', 'non-négociable']):
            return "RULE"

        # Détection CONTACT / CLIENT
        if any(word in t for word in ['email', 'téléphone', 'contact', '@', 'prospect', 'client']):
            return "CONTACT"

        return "GENERAL"

rag_service = RAGService()
