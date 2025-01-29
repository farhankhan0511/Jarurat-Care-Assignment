# Volunteer Management System for Jarurat Care NGO

This project aims to support **Jarurat Care NGO** in managing volunteer openings and registrations through an API-based solution. Upon reviewing the NGO's website, I identified the need for an efficient system that allows the admin to manage volunteer openings and for users to view and apply for these openings. The key functionalities revolve around admin privileges and user registration for volunteer opportunities.

## Key Features

### 1. Admin Role:
- Admins can **create**, **update**, **delete**, and **view** volunteer openings.
- Admins can **view all applicants** who have registered for specific volunteer openings.
- Admins have a **secure authentication and authorization** system that prevents unauthorized access.

### 2. User Role:
- Users can **register** for volunteer openings by submitting their resumes.
- Users can **view all available volunteer openings** and apply to the ones they are interested in.

### 3. Authentication & Authorization:
- Robust **authentication via JWT (JSON Web Token)** ensures secure user login and registration.
- **Role-based access control** ensures that only admins can perform administrative actions, while users can only access the features relevant to their role.
- **Middlewares** like `verifyJWT` and `isadmin` are used for authentication and authorization, respectively.

## Project Details

### Admin Routes:
- `/add`: To **add** a new volunteer opening (Admin-only access).
- `/delete/:openingid`: To **delete** a specific volunteer opening (Admin-only access).
- `/update/:openingid`: To **update** an existing opening (Admin-only access).
- `/all`: To **fetch** all volunteer openings.
- `/getapplicants/:openingid`: To **view all applicants** for a specific opening (Admin-only access).

### User Routes:
- `/register`: **User registration** for volunteer opening (JWT required).
- `/login`: **User login**.
- `/register/:openingid`: To **register** for a specific volunteer opening by submitting a resume (JWT required).

## Technical Aspects

- **Backend Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **File Handling:** Multer middleware for handling image uploads and resume files.
- **Deployment:** The API has been successfully **deployed on Azure** and is available for use.

## Vision

The original vision for the project was to create a comprehensive volunteer management platform for **Jarurat Care NGO**. Due to time constraints, the project was completed with a focus on the core functionalities, and further development is possible.

## Future Enhancements
- Additional **user management features**, such as profile updates.
- **Email notifications** for users upon successful registration or admin updates.
- Expanding the **admin panel** for more granular management features.

## Project Testing
The APIs have been thoroughly tested using **Postman**. Below are some of the screenshots showcasing the successful execution of the APIs.
