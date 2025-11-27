from django.contrib import admin
from django.urls import path
from api.views.orientation import (
    OrientationList,
    OrientationDetail,
    OrientationByCode,
    OrientationByBacType,
    OrientationByInstitution,
    OrientationByCategory,
    OrientationBySpecialty,
    OrientationByDegree,
    OrientationByRegion,
    DegreeList,
    SpecialtyList,
    RegionList

)
from api.views.etudiant import (
    RegisterView,
    LoginView,
    EtudiantListView,
    EtudiantDetailView,
    EtudiantProfileView,
    EtudiantByBacTypeView,
    EtudiantBySessionView,
    EtudiantByVilleView
)
from api.views.google_auth import GoogleAuthView 
from api.views.email_confirmation import ConfirmEmailView

urlpatterns = [
    path('admin/', admin.site.urls),

    # MongoDB API endpoints
    path('api/orientations/', OrientationList.as_view(), name='orientation-list'),
    path('api/orientations/<str:orientation_id>/', OrientationDetail.as_view(), name='orientation-detail'),
    path('api/orientations/code/<int:code>/', OrientationByCode.as_view(), name='orientation-by-code'),
    path('api/orientations/bac/<str:bac_type>/', OrientationByBacType.as_view(), name='orientation-by-bac'),

    # New filters
    path('api/orientations/institution/<str:institution>/', OrientationByInstitution.as_view(), name='orientation-by-institution'),
    path('api/orientations/category/<str:category>/', OrientationByCategory.as_view(), name='orientation-by-category'),
    path('api/orientations/specialty/<str:specialty>/', OrientationBySpecialty.as_view(), name='orientation-by-specialty'),
    path('api/orientations/degree/<str:degree>/', OrientationByDegree.as_view(), name='orientation-by-degree'), 
    path('api/orientations/region/<str:region>/', OrientationByRegion.as_view(), name='orientation-by-region'), 
    path('api/orientations/degrees/all/', DegreeList.as_view(), name='degrees-list'),
    path('api/orientations/specialties/all/', SpecialtyList.as_view(), name='specialties-list'),  # Add this line
    path('api/orientations/regions/all/', RegionList.as_view(), name='regions-list'),

    path('api/auth/google/', GoogleAuthView.as_view(), name='google-auth'),
    path('api/auth/confirm-email/', ConfirmEmailView.as_view(), name='confirm-email'),
     
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/etudiants/', EtudiantListView.as_view(), name='list-etudiants'),
    path('api/etudiants/<str:id>/', EtudiantDetailView.as_view(), name='etudiant-detail'),
    path('api/profile/', EtudiantProfileView.as_view(),name='etudiant-profile'),
        path('api/etudiants/bac-type/<str:bac_type>/', EtudiantByBacTypeView.as_view(), name='etudiants-by-bac-type'),
    path('api/etudiants/session/<str:session>/', EtudiantBySessionView.as_view(), name='etudiants-by-session'),
    path('api/etudiants/ville/<str:ville>/', EtudiantByVilleView.as_view(), name='etudiants-by-ville'),
]

