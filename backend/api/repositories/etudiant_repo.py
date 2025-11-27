from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
import jwt
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from decouple import config

class EtudiantRepository:
    def __init__(self):
        self.client = MongoClient(config('MONGODB_URI'))
        self.db = self.client[config('DB_NAME')]
        self.collection = self.db['etudiants']

    # CRUD Operations
    def create(self, validated_data):
        if self.email_exists(validated_data['email']):
            raise ValueError("Email déjà utilisé")
        if self.username_exists(validated_data['username']):
            raise ValueError("Nom d'utilisateur déjà utilisé")

        validated_data['password'] = make_password(validated_data['password'])
        validated_data['created_at'] = datetime.utcnow()

        # 💡 Calcul du FG ici
        validated_data['fg'] = self.calculate_fg(validated_data)

        result = self.collection.insert_one(validated_data)
        return self._format_document(self.collection.find_one({'_id': result.inserted_id}))

    def get_by_id(self, etudiant_id):
        doc = self.collection.find_one({'_id': ObjectId(etudiant_id)})
        return self._format_document(doc)

    def get_by_email(self, email):
        doc = self.collection.find_one({'email': email})
        return self._format_document(doc)

    def update(self, etudiant_id, validated_data):
        existing = self.collection.find_one({'_id': ObjectId(etudiant_id)})
        if not existing:
            raise ValueError("Étudiant introuvable")

        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])

        # Merge data without losing existing fields
        merged_data = {**existing, **validated_data}

        # ✅ AUTORISER la modification de la ville et du type de bac
        # Ces champs peuvent maintenant être modifiés
        if 'ville' in validated_data:
            merged_data['ville'] = validated_data['ville']
        if 'bac_type' in validated_data:
            merged_data['bac_type'] = validated_data['bac_type']
            # Si le type de bac change, on peut réinitialiser certaines notes si nécessaire
            # ou garder les notes existantes

        # Recalcul FG après mise à jour (si mg, notes, ou type de bac changent)
        # Le FG dépend du type de bac, donc il doit être recalculé si le type de bac change
        merged_data['fg'] = self.calculate_fg(merged_data)
        
        # Mettre à jour la date de modification
        merged_data['updated_at'] = datetime.utcnow()

        # Retirer _id avant update pour éviter les conflits
        merged_data.pop('_id', None)

        # Mettre à jour dans la base de données
        self.collection.update_one(
            {'_id': ObjectId(etudiant_id)},
            {'$set': merged_data}
        )
        
        # Retourner l'étudiant mis à jour
        return self.get_by_id(etudiant_id)

    def delete(self, etudiant_id):
        result = self.collection.delete_one({'_id': ObjectId(etudiant_id)})
        return result.deleted_count > 0

    def list_all(self):
        return [self._format_document(doc) for doc in self.collection.find()]

    # Authentication
    def login_user(self, email, password):
        user = self.collection.find_one({'email': email})
        if not user:
            return None, "Email introuvable"
        if not check_password(password, user['password']):
            return None, "Mot de passe incorrect"

        payload = {
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow()
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return token, None

    # Business Logic
    def calculate_fg(self, data):
        type_bac = data['bac_type']
        MG = data['mg']
        get = lambda attr: data.get(attr, 0) or 0

        if type_bac == "آداب":
            return 4 * MG + 1.5 * get("A") + 1.5 * get("PH") + get("HG") + get("F") + get("Ang")
        elif type_bac == "رياضيات":
            return 4 * MG + 2 * get("M") + 1.5 * get("SP") + 0.5 * get("SVT") + get("F") + get("Ang")
        elif type_bac == "علوم تجريبية":
            return 4 * MG + get("M") + 1.5 * get("SP") + 1.5 * get("SVT") + get("F") + get("Ang")
        elif type_bac == "اقتصاد وتصرف":
            return 4 * MG + 1.5 * get("Ec") + 1.5 * get("Ge") + 0.5 * get("M") + get("HG") + get("F") + get("Ang")
        elif type_bac == "العلوم التقنية":
            return 4 * MG + 1.5 * get("TE") + 1.5 * get("M") + get("SP") + get("F") + get("Ang")
        elif type_bac == "علوم الإعلامية":
            return 4 * MG + 1.5 * get("M") + 1.5 * get("Algo") + 0.5 * get("SP") + 0.5 * get("STI") + get("F") + get("Ang")
        elif type_bac == "رياضة":
            return 4 * MG + 1.5 * get("SB") + get("Sp_sport") + 0.5 * get("EP") + 0.5 * get("SP") + 0.5 * get("PH") + get("F") + get("Ang")
        return 0.0

    # Helpers
    def _format_document(self, doc):
        if not doc:
            return None
        doc['id'] = str(doc.pop('_id'))
        doc.pop('password', None)
        return doc

    def email_exists(self, email):
        return bool(self.collection.find_one({'email': email}))

    def username_exists(self, username):
        return bool(self.collection.find_one({'username': username}))
    def get_by_bac_type(self, bac_type):
        """Récupérer les étudiants par type de bac"""
        docs = self.collection.find({'bac_type': bac_type})
        return [self._format_document(doc) for doc in docs]

    def get_by_session(self, session):
        """Récupérer les étudiants par session"""
        docs = self.collection.find({'session': session})
        return [self._format_document(doc) for doc in docs]

    def get_by_ville(self, ville):
        """Récupérer les étudiants par ville"""
        docs = self.collection.find({'ville': ville})
        return [self._format_document(doc) for doc in docs] 