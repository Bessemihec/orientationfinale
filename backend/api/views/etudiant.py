from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers.etudiant import EtudiantSerializer
from ..repositories.etudiant_repo import EtudiantRepository
from rest_framework.authentication import get_authorization_header
import jwt
from django.conf import settings
repo = EtudiantRepository()

class RegisterView(APIView):
    def post(self, request):
        serializer = EtudiantSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            etudiant = repo.create(serializer.validated_data)
            return Response({
                'message': 'Inscription réussie',
                'etudiant': EtudiantSerializer(etudiant).data
            }, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        token, error = repo.login_user(email, password)
        if error:
            return Response({'error': error}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'message': 'Connexion réussie', 'token': token})

class EtudiantListView(APIView):
    def get(self, request):
        etudiants = repo.list_all()
        serializer = EtudiantSerializer(etudiants, many=True)
        return Response({
            'message': 'Liste des étudiants récupérée avec succès',
            'etudiants': serializer.data
        })

class EtudiantDetailView(APIView):
    def get(self, request, id):
        etudiant = repo.get_by_id(id)
        if not etudiant:
            return Response({'error': 'Étudiant non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        serializer = EtudiantSerializer(etudiant)
        return Response({
            'message': 'Étudiant récupéré avec succès',
            'etudiant': serializer.data
        })

    def put(self, request, id):
        etudiant = repo.get_by_id(id)
        if not etudiant:
            return Response({'error': 'Étudiant non trouvé'}, status=status.HTTP_404_NOT_FOUND)

        serializer = EtudiantSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            updated = repo.update(id, serializer.validated_data)
            return Response({
                'message': 'Mise à jour réussie',
                'etudiant': EtudiantSerializer(updated).data
            })
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        if repo.delete(id):
            return Response({'message': 'Suppression avec succès'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Étudiant non trouvé'}, status=status.HTTP_404_NOT_FOUND)
class EtudiantProfileView(APIView):
    def get(self, request):
        auth_header = get_authorization_header(request).split()
        if not auth_header or auth_header[0].lower() != b'bearer' or len(auth_header) != 2:
            return Response({'error': 'Token manquant ou invalide'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            token = auth_header[1]
            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = decoded.get('user_id')  # Tu dois t'assurer que tu stockes 'id' dans le token côté login
            etudiant = repo.get_by_id(user_id)

            if not etudiant:
                return Response({'error': 'Étudiant non trouvé'}, status=status.HTTP_404_NOT_FOUND)

            serializer = EtudiantSerializer(etudiant)
            return Response({'etudiant': serializer.data})
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token expiré'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Token invalide'}, status=status.HTTP_401_UNAUTHORIZED)
class EtudiantByBacTypeView(APIView):
    def get(self, request, bac_type):
        try:
            etudiants = repo.get_by_bac_type(bac_type)
            serializer = EtudiantSerializer(etudiants, many=True)
            return Response({
                'message': f'Étudiants de type {bac_type} récupérés avec succès',
                'etudiants': serializer.data
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class EtudiantBySessionView(APIView):
    def get(self, request, session):
        try:
            etudiants = repo.get_by_session(session)
            serializer = EtudiantSerializer(etudiants, many=True)
            return Response({
                'message': f'Étudiants de session {session} récupérés avec succès',
                'etudiants': serializer.data
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class EtudiantByVilleView(APIView):
    def get(self, request, ville):
        try:
            etudiants = repo.get_by_ville(ville)
            serializer = EtudiantSerializer(etudiants, many=True)
            return Response({
                'message': f'Étudiants de ville {ville} récupérés avec succès',
                'etudiants': serializer.data
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)