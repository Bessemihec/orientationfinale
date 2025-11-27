import requests
from django.conf import settings
from datetime import datetime, timedelta
import jwt
import secrets
import string
from ..repositories.etudiant_repo import EtudiantRepository

class GoogleAuthService:
    def __init__(self):
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        self.etudiant_repo = EtudiantRepository()

    def get_google_user_info(self, access_token):
        """
        Récupère les informations utilisateur depuis Google avec le access_token
        """
        try:
            print(f"🔍 Vérification du token Google avec client_id: {self.client_id}")
            
            # Vérifier que le token est valide et récupérer les infos utilisateur
            response = requests.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f'Bearer {access_token}'},
                timeout=10
            )
            
            print(f"📡 Réponse Google API: {response.status_code}")
            
            if response.status_code == 200:
                user_data = response.json()
                print(f"✅ Données utilisateur Google: {user_data}")
                
                return {
                    'email': user_data['email'],
                    'first_name': user_data.get('given_name', ''),
                    'last_name': user_data.get('family_name', ''),
                    'google_id': user_data['sub'],
                    'picture': user_data.get('picture', ''),
                    'email_verified': user_data.get('email_verified', False)
                }
            else:
                error_data = response.json()
                print(f"❌ Erreur Google API: {error_data}")
                raise ValueError(f'Erreur Google API: {error_data.get("error_description", "Unknown error")}')
                
        except requests.RequestException as e:
            print(f"❌ Erreur réseau: {str(e)}")
            raise ValueError(f'Erreur de connexion à Google: {str(e)}')

    def authenticate_or_create_user(self, google_user_data):
        """
        Authentifie ou crée un utilisateur avec les données Google
        """
        email = google_user_data['email']
        
        # Vérifier si l'utilisateur existe déjà
        existing_user = self.etudiant_repo.get_by_email(email)
        
        if existing_user:
            print(f"✅ Utilisateur existant trouvé: {email}")
            # Utilisateur existe - mettre à jour google_id si nécessaire
            if not existing_user.get('google_id'):
                updated_data = {'google_id': google_user_data['google_id']}
                self.etudiant_repo.update(existing_user['id'], updated_data)
                existing_user['google_id'] = google_user_data['google_id']
            
            # Générer le token JWT
            token = self.generate_jwt_token(existing_user['id'])
            return token, existing_user, False  # False = utilisateur existant
        
        else:
            print(f"🆕 Création d'un nouvel utilisateur: {email}")
            # Créer un nouvel utilisateur
            username = self.generate_username(google_user_data)
            
            user_data = {
                'username': username,
                'email': email,
                'password': self.generate_random_password(),
                'ville': '',
                'bac_type': '',
                'mg': 0,
                'session': 'principale',
                'google_id': google_user_data['google_id']
            }
            
            new_user = self.etudiant_repo.create(user_data)
            token = self.generate_jwt_token(new_user['id'])
            
            return token, new_user, True  # True = nouvel utilisateur

    def generate_username(self, google_user_data):
        """Génère un username unique basé sur le nom Google"""
        first_name = google_user_data['first_name'] or 'user'
        last_name = google_user_data['last_name'] or 'google'
        
        base_username = f"{first_name}_{last_name}".lower().replace(' ', '_')
        username = base_username
        
        # Vérifier si le username existe déjà
        counter = 1
        while self.etudiant_repo.username_exists(username):
            username = f"{base_username}_{counter}"
            counter += 1
            
        return username

    def generate_random_password(self):
        """Génère un mot de passe sécurisé aléatoire"""
        alphabet = string.ascii_letters + string.digits + string.punctuation
        return ''.join(secrets.choice(alphabet) for _ in range(24))

    def generate_jwt_token(self, user_id):
        """Génère un token JWT pour l'utilisateur"""
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(days=7),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')