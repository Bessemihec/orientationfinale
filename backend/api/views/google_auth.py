# api/views/google_auth.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..services.google_auth_service import GoogleAuthService

class GoogleAuthView(APIView):
    def post(self, request):
        """
        Authentification avec Google via access_token
        """
        access_token = request.data.get('access_token')
        
        if not access_token:
            return Response(
                {'error': 'Access token Google requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            google_service = GoogleAuthService()
            
            # Récupérer les infos utilisateur depuis Google
            google_user_data = google_service.get_google_user_info(access_token)
            
            # Vérifier que l'email est vérifié
            if not google_user_data.get('email_verified', False):
                return Response(
                    {'error': 'Email Google non vérifié'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Authentifier ou créer l'utilisateur
            jwt_token, user, is_new_user = google_service.authenticate_or_create_user(google_user_data)
            
            return Response({
                'message': 'Connexion Google réussie',
                'token': jwt_token,
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'is_new_user': is_new_user,
                    'profile_complete': bool(user.get('bac_type') and user.get('mg'))
                }
            })
            
        except ValueError as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Google auth error: {str(e)}")
            return Response(
                {'error': 'Erreur interne lors de l\'authentification'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )