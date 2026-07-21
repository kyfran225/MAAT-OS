from abc import ABC, abstractmethod
from typing import List, Dict, Any
import requests

class CRMConnector(ABC):
    """
    Interface abstraite pour les connecteurs CRM.
    """
    @abstractmethod
    def sync_contacts(self, api_key: str) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def push_contact(self, api_key: str, contact_data: Dict[str, Any]) -> bool:
        pass

class HubSpotConnector(CRMConnector):
    """
    Connecteur pour HubSpot CRM.
    """
    def sync_contacts(self, api_key: str) -> List[Dict[str, Any]]:
        # Simulation d'appel API HubSpot
        # URL réelle : https://api.hubapi.com/crm/v3/objects/contacts
        print(f"Syncing contacts from HubSpot with key: {api_key[:5]}***")
        return [
            {
                "id": "hs-1",
                "name": "Jean Dupont",
                "email": "jean.dupont@techpme.fr",
                "company": "TechPME France",
                "estimatedBudget": 12000,
                "status": "prospect"
            },
            {
                "id": "hs-2",
                "name": "Marie Leroi",
                "email": "m.leroi@distrib-africa.com",
                "company": "Distrib Africa",
                "estimatedBudget": 45000,
                "status": "customer"
            }
        ]

    def push_contact(self, api_key: str, contact_data: Dict[str, Any]) -> bool:
        print(f"Pushing contact to HubSpot: {contact_data.get('name')}")
        return True

class WhatsAppConnector:
    """
    Connecteur pour WhatsApp Business API.
    Gère l'envoi de messages et la collecte de leads via chat.
    """
    def send_message(self, api_key: str, phone_number: str, text: str):
        # Simulation d'envoi via Meta Graph API
        print(f"Sending WhatsApp message to {phone_number}: {text[:30]}...")
        return {"status": "sent", "message_id": "wa-msg-123"}

    def receive_webhook(self, data: Dict[str, Any]):
        # Traitement des messages entrants
        pass
