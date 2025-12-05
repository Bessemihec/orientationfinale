from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from urllib.parse import unquote
from ..repositories.mock_orientation_repository import MockOrientationRepository
from ..serializers.orientation import OrientationSerializer

class OrientationList(APIView):
    def get(self, request):
        repo = MockOrientationRepository()
        try:
            orientations = repo.get_all()
            serializer = OrientationSerializer(orientations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrientationDetail(APIView):
    def get(self, request, orientation_id):
        repo = MockOrientationRepository()
        try:
            orientation = repo.get_by_id(orientation_id)
            if orientation:
                serializer = OrientationSerializer(orientation)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Orientation not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrientationByCode(APIView):
    def get(self, request, code):
        repo = MockOrientationRepository()
        try:
            orientations = repo.get_by_code(code)
            if orientations:
                serializer = OrientationSerializer(orientations, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No orientations found for the given code'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrientationByBacType(APIView):
    def get(self, request, bac_type):
        try:
            repo = MockOrientationRepository()
            orientations = repo.get_by_bac_type(bac_type)
            serializer = OrientationSerializer(orientations, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class OrientationByInstitution(APIView):
    def get(self, request, institution):
        try:
            institution = unquote(institution)
            repo = MockOrientationRepository()
            orientations = repo.get_by_institution(institution)
            serializer = OrientationSerializer(orientations, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class OrientationByCategory(APIView):
    def get(self, request, category):
        try:
            category = unquote(category)
            repo = MockOrientationRepository()
            orientations = repo.get_by_category(category)
            serializer = OrientationSerializer(orientations, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class OrientationBySpecialty(APIView):
    def get(self, request, specialty):
        try:
            specialty = unquote(specialty)
            repo = MockOrientationRepository()
            orientations = repo.get_by_specialty(specialty)
            serializer = OrientationSerializer(orientations, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
class OrientationByDegree(APIView):
    def get(self, request, degree):
        repo = MockOrientationRepository()
        orientations = repo.get_by_degree(degree)
        serializer = OrientationSerializer(orientations, many=True)
        return Response(serializer.data)
    
class DegreeList(APIView):
    def get(self, request):
        try:
            repo = MockOrientationRepository()
            degrees = repo.get_all_degrees()
            return Response(list(degrees), status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class SpecialtyList(APIView):
    def get(self, request):
        try:
            repo = MockOrientationRepository()
            specialties = repo.get_all_specialties()
            return Response(list(specialties), status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class RegionList(APIView):
    def get(self, request):
        try:
            repo = MockOrientationRepository()
            regions = repo.get_all_regions()
            return Response(list(regions), status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrientationByRegion(APIView):
    def get(self, request, region):
        try:
            region = unquote(region)
            repo = MockOrientationRepository()
            orientations = repo.get_by_region(region)
            serializer = OrientationSerializer(orientations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)