from datetime import datetime  # ← AJOUTEZ CETTE LIGNE
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import jwt
from django.conf import settings
from bson import ObjectId
from ..repositories.etudiant_repo import EtudiantRepository

class ConfirmEmailView(APIView):
    def post(self, request):
        # ✅ Récupérer le token depuis les query params OU le body
        token = request.data.get('token') or request.query_params.get('token')
        
        if not token:
            print("❌ Token manquant dans la requête")
            return Response(
                {'error': 'Token manquant'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            print(f"🔍 Token reçu: {token[:50]}...")
            
            # ✅ Décoder le token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            print(f"📄 Payload décodé: {payload}")
            
            user_id = payload.get('user_id')
            user_email = payload.get('email')
            
            print(f"🔑 User ID: {user_id}")
            print(f"📧 Email: {user_email}")
            
            if not user_id:
                print("❌ user_id manquant dans le token")
                return Response(
                    {'error': 'Token invalide'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # ✅ Convertir en ObjectId
            try:
                user_id_obj = ObjectId(user_id)
                print(f"🔑 ObjectId converti: {user_id_obj}")
            except Exception as e:
                print(f"❌ Erreur conversion ObjectId: {e}")
                return Response(
                    {'error': 'ID utilisateur invalide'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # ✅ Mettre à jour l'utilisateur
            repo = EtudiantRepository()
            
            # D'abord vérifier si l'utilisateur existe
            user_exists = repo.collection.find_one({'_id': user_id_obj})
            if not user_exists:
                print(f"❌ Utilisateur {user_id_obj} non trouvé en base")
                return Response(
                    {'error': 'Utilisateur non trouvé'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            print(f"✅ Utilisateur trouvé: {user_exists.get('username')}")
            
            # Mettre à jour le champ email_verified
            result = repo.collection.update_one(
                {'_id': user_id_obj},
                {'$set': {'email_verified': True, 'updated_at': datetime.utcnow()}}  # ← Ici on utilise datetime
            )
            
            print(f"📝 Résultat MongoDB - Correspondances: {result.matched_count}, Modifications: {result.modified_count}")
            
            if result.modified_count > 0:
                print("🎉 Email confirmé avec succès!")
                return Response({
                    'message': 'Email confirmé avec succès',
                    'email': user_email,
                    'username': user_exists.get('username')
                })
            else:
                if result.matched_count > 0:
                    print("ℹ️ Email déjà vérifié précédemment")
                    return Response({
                        'message': 'Email déjà vérifié',
                        'email': user_email
                    })
                else:
                    print("❌ Aucun document correspondant trouvé")
                    return Response({
                        'error': 'Erreur lors de la confirmation'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except jwt.ExpiredSignatureError:
            print("❌ Token expiré")
            return Response(
                {'error': 'Le lien de confirmation a expiré. Veuillez demander un nouveau lien.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.InvalidTokenError as e:
            print(f"❌ Token invalide: {e}")
            return Response(
                {'error': 'Lien de confirmation invalide'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"❌ Erreur serveur inattendue: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': 'Erreur interne du serveur'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )