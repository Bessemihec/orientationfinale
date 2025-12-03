# Orientation Finale

A comprehensive student orientation platform that helps Tunisian students find their ideal university programs based on their baccalaureate type, scores, and preferences.

## Features

- **Multi-language Support**: Arabic, French, and English
- **Smart Orientation**: AI-powered recommendations based on student profiles
- **Advanced Filtering**: Filter by institution, region, specialty, degree type
- **Score Calculator**: Calculate admission chances based on previous years' data
- **User Profiles**: Personalized dashboards for students
- **Real-time Chat**: Integrated chatbot for assistance
- **Data Visualization**: Charts and analytics for orientation trends

## Tech Stack

### Backend
- **Django 5.2.9**: Web framework
- **Django REST Framework**: API development
- **MongoDB**: NoSQL database
- **PyMongo**: MongoDB driver
- **python-decouple**: Environment configuration
- **django-cors-headers**: CORS handling

### Frontend
- **React 19.1.0**: UI framework
- **React Router 6.30.0**: Client-side routing
- **Axios**: HTTP client
- **Chart.js 4.5.0**: Data visualization
- **i18next**: Internationalization
- **React Toastify**: Notifications
- **Google OAuth**: Authentication

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB 4.4+

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   DB_NAME=orientation_db
   MONGODB_URI=mongodb://localhost:27017/
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   DEFAULT_FROM_EMAIL=noreply@orientation.tn
   ```

3. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

4. **Run Django server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start React development server**
   ```bash
   npm start
   ```

## API Endpoints

### Orientation Endpoints
- `GET /api/orientations/` - List all orientations
- `GET /api/orientations/{id}/` - Get specific orientation
- `GET /api/orientations/code/{code}/` - Filter by code
- `GET /api/orientations/bac/{bac_type}/` - Filter by baccalaureate type
- `GET /api/orientations/institution/{institution}/` - Filter by institution
- `GET /api/orientations/category/{category}/` - Filter by category
- `GET /api/orientations/specialty/{specialty}/` - Filter by specialty
- `GET /api/orientations/degree/{degree}/` - Filter by degree
- `GET /api/orientations/region/{region}/` - Filter by region

### Reference Data
- `GET /api/orientations/degrees/all/` - All available degrees
- `GET /api/orientations/specialties/all/` - All available specialties
- `GET /api/orientations/regions/all/` - All available regions

### Authentication
- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `GET /api/profile/` - User profile
- `POST /api/auth/google/` - Google OAuth

## Database Schema

The application uses MongoDB with the following main collection:

### Orientation Collection
```javascript
{
  "_id": ObjectId,
  "الفئة": "Category",
  "الإجازة / الشعبة": "Degree",
  "المؤسسة والجامعة": "Institution",
  "التخصصات": "Specialties",
  "الرمز": 101,
  "نوع البكالوريا": "Baccalaureate Type",
  "صيغة احتساب مجموع نقاط": "Score Calculation Format",
  "مجموع نقاط آخر موجه 2023": "Last Year Score",
  "الجنس": "Gender",
  "مواد اجبارية": "Mandatory Subjects",
  "اختبار": "Test Required",
  "التنفيل الجغرافي": "Geographic Preference",
  "الولاية": "Region"
}
```

## Deployment

### Environment Variables
Make sure to set the following environment variables in production:

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
DB_NAME=orientation_production
MONGODB_URI=mongodb://your-production-db-url/
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
EMAIL_HOST_USER=your-production-email
EMAIL_HOST_PASSWORD=your-production-email-password
```

### Frontend Build
```bash
cd frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or open an issue in the repository.

---

**Note**: This application is specifically designed for the Tunisian education system and uses Arabic field names in the database to match the official orientation data.
