from ..models.orientation import Orientation

class MockOrientationRepository:
    """Mock repository for testing without MongoDB"""
    
    def __init__(self):
        # Sample data for testing
        self.sample_data = [
            {
                'id': '1',
                'category': 'علوم وتقنيات',
                'degree': 'إجازة في علوم الحاسوب',
                'institution': 'جامعة تونس',
                'specialties': 'برمجة، شبكات',
                'code': 101,
                'bac_type': 'رياضيات',
                'calculation_format': 'مجموع المواد',
                'last_year_score': '15.5',
                'gender': 'ذكر',
                'matiere_principale': 'رياضيات، فيزياء',
                'test': 'لا',
                'geographic_preference': 'تونس',
                'region': 'تونس'
            },
            {
                'id': '2',
                'category': 'علوم إنسانية',
                'degree': 'إجازة في اللغة العربية',
                'institution': 'جامعة المنستير',
                'specialties': 'لغة، أدب',
                'code': 102,
                'bac_type': 'آداب',
                'calculation_format': 'مجموع المواد',
                'last_year_score': '14.2',
                'gender': 'أنثى',
                'matiere_principale': 'لغة عربية، فلسفة',
                'test': 'نعم',
                'geographic_preference': 'المنستير',
                'region': 'المنستير'
            }
        ]
    
    def _doc_to_orientation(self, doc):
        return Orientation(
            id=doc['id'],
            category=doc['category'],
            degree=doc['degree'],
            institution=doc['institution'],
            specialties=doc['specialties'],
            code=doc['code'],
            bac_type=doc['bac_type'],
            calculation_format=doc['calculation_format'],
            last_year_score=doc['last_year_score'],
            gender=doc['gender'],
            matiere_principale=doc['matiere_principale'],
            test=doc['test'],
            geographic_preference=doc['geographic_preference'],
            region=doc['region']
        )
    
    def get_all(self):
        return [self._doc_to_orientation(doc) for doc in self.sample_data]
    
    def get_by_id(self, orientation_id):
        for doc in self.sample_data:
            if doc['id'] == orientation_id:
                return self._doc_to_orientation(doc)
        return None
    
    def get_by_code(self, code):
        results = [self._doc_to_orientation(doc) for doc in self.sample_data if doc['code'] == code]
        return results
    
    def get_by_bac_type(self, bac_type):
        results = [self._doc_to_orientation(doc) for doc in self.sample_data if doc['bac_type'] == bac_type]
        return results
    
    def get_by_institution(self, institution):
        results = [self._doc_to_orientation(doc) for doc in self.sample_data if doc['institution'] == institution]
        return results
    
    def get_by_category(self, category):
        results = [self._doc_to_orientation(doc) for doc in self.sample_data if doc['category'] == category]
        return results
    
    def get_by_specialty(self, specialty):
        results = []
        for doc in self.sample_data:
            if specialty.lower() in doc['specialties'].lower():
                results.append(self._doc_to_orientation(doc))
        return results
    
    def get_by_degree(self, degree):
        results = [self._doc_to_orientation(doc) for doc in self.sample_data if doc['degree'] == degree]
        return results
    
    def get_by_region(self, region):
        results = [self._doc_to_orientation(doc) for doc in self.sample_data if doc['region'] == region]
        return results
    
    def get_all_degrees(self):
        return list(set([doc['degree'] for doc in self.sample_data]))
    
    def get_all_specialties(self):
        specialties = set()
        for doc in self.sample_data:
            for specialty in doc['specialties'].split('،'):
                specialties.add(specialty.strip())
        return list(specialties)
    
    def get_all_regions(self):
        return list(set([doc['region'] for doc in self.sample_data]))
