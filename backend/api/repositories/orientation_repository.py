from pymongo import MongoClient
from decouple import config
from ..models.orientation import Orientation
from bson import ObjectId

class OrientationRepository:
    def __init__(self):
        self.client = MongoClient(config('MONGODB_URI'))
        self.db = self.client[config('DB_NAME')]
        self.collection = self.db['orientationfinale']

    def _doc_to_orientation(self, doc):
        return Orientation(
            id=str(doc.get('_id')),
            category=doc.get('الفئة'),
            degree=doc.get('الإجازة / الشعبة'),
            institution=doc.get('المؤسسة والجامعة'),
            specialties=doc.get('التخصصات'),
            code=doc.get('الرمز'),
            bac_type=doc.get('نوع البكالوريا'),
            calculation_format=doc.get('صيغة احتساب مجموع نقاط'),
            last_year_score=doc.get('مجموع نقاط آخر موجه 2023'),
            gender=doc.get('الجنس'),
            matiere_principale=doc.get('مواد اجبارية'),
            test=doc.get('اختبار'),
            geographic_preference=doc.get('التنفيل الجغرافي'),  # Valeur par défaut vide string
            region=doc.get('الولاية')  
        )

    def get_all(self):
        documents = list(self.collection.find({}))
        return [self._doc_to_orientation(doc) for doc in documents]

    def get_by_id(self, orientation_id):
        doc = self.collection.find_one({'_id': ObjectId(orientation_id)})
        return self._doc_to_orientation(doc) if doc else None

    def get_by_code(self, code):
        docs = self.collection.find({'الرمز': code})
        return [self._doc_to_orientation(doc) for doc in docs]

    def get_by_bac_type(self, bac_type):
        docs = self.collection.find({'نوع البكالوريا': bac_type})
        return [self._doc_to_orientation(doc) for doc in docs]

    def get_by_institution(self, institution):
        docs = self.collection.find({'المؤسسة والجامعة': institution})
        return [self._doc_to_orientation(doc) for doc in docs]

    def get_by_category(self, category):
        docs = self.collection.find({'الفئة': category})
        return [self._doc_to_orientation(doc) for doc in docs]

    def get_by_specialty(self, specialty):
        print(f"Repository searching for specialty: '{specialty}'")
        
        # Nettoyer la spécialité recherchée
        cleaned_specialty = specialty.replace('\n', ' ').replace('  ', ' ').strip()
        print(f"Searching for cleaned specialty: '{cleaned_specialty}'")
        
        results = []
        all_docs = self.collection.find()
        
        for doc in all_docs:
            doc_specialties = doc.get('التخصصات', '')
            
            # Diviser les spécialités du document par saut de ligne
            specialties_list = doc_specialties.split('\n')
            
            # Nettoyer chaque spécialité
            cleaned_doc_specialties = [s.strip() for s in specialties_list if s.strip()]
            
            # Vérifier si la spécialité recherchée est dans la liste
            if cleaned_specialty in cleaned_doc_specialties:
                results.append(self._doc_to_orientation(doc))
        
        print(f"Repository found {len(results)} results")
        return results
    def get_by_degree(self, degree):
        docs = self.collection.find({'الإجازة / الشعبة': degree})
        return [self._doc_to_orientation(doc) for doc in docs]
    def get_all_degrees(self):
        degrees = self.collection.distinct('الإجازة / الشعبة')
        return degrees
    def get_all_specialties(self):
        specialties = self.collection.distinct('التخصصات')
        # Filter out None/empty values and return a cleaned list
        return [spec for spec in specialties if spec]

    def get_by_region(self, region):
        docs = self.collection.find({'الولاية': region})
        return [self._doc_to_orientation(doc) for doc in docs]

    def get_all_regions(self):
        regions = self.collection.distinct('الولاية')
        return [region for region in regions if region]  