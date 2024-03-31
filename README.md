# Air Quality Repository - MoQA Network

## About the Project

This project aims to develop and implement an air quality monitoring network through devices called MoQA (Monitor of Air Quality), launched in partnership with various institutions, including Vital Strategies - New York and the Science, Technology and Innovation Foundation of Fortaleza (CITINOVA). The "Air Quality Repository - MoQA Network" platform was developed to facilitate access and management of the collected data, promoting a healthier and more sustainable environment.

## Key Features

- **Advanced Monitoring:** Use of MoQA devices for environmental and pollutant data collection.
- **Accessible Platform:** A dedicated web platform available for viewing and managing the collected data.
- **Data Security:** User authentication and database management services provided by Google Authentication and Firestore.
- **Modern Development:** Application developed with Vue.js, using HTML, CSS, and JavaScript.

## Target Audience

The platform is primarily intended for technicians responsible for the deployment and monitoring of the air quality network, ensuring restricted and secure access to data through authentication.

## Technologies Used

- **Front-end:** Vue.js (with HTML, CSS, SASS)
- **Back-end:** Firebase (Authentication and Firestore for database management)

## Deployment and User Authentication

- The project employs Google's Authentication for secure user login and Firestore for efficient and scalable data management.
- User roles and permissions are clearly defined, ensuring data access is granted according to the user's level of authorization.

## Development and Deployment

- Developed within the Traffic, Transport, and Environment Laboratory (GTTEMA), specifically in the Transport and Environment Research Core (TRAMA), with financial support from Vital Strategies - New York and in partnership with CITINOVA.
- Aims to make the platform available at a unique internet address to ease its usage.

## Data Visualization and User Interaction

- Provides a user-friendly interface for data visualization, including dashboards, data export functions, and a city map highlighting monitor locations.
- Utilizes responsive design to ensure accessibility on both desktop and mobile devices, with language support for English and Brazilian Portuguese.


## Setup Instructions

To run this project, you will need to perform the following steps:

1. **Firebase Project**: You must have a Firebase project set up. Once you have created your project, copy the environment variable values according to the `.env.sample` file provided in this repository.

2. **Database Collections**: This project utilizes two main collections in Firebase:

   - **Markers Collection**: set as `VUE_APP_DATA_COLLECTION_NAME`, stores geolocation information of air quality monitors. Each document in this collection must include the following fields:
     - `id`: A unique identifier for the monitor.
     - `name`: The name of the monitor.
     - `moqaID`: A specific identifier linking to the MoQA device.
     - `lat`: Latitude coordinate.
     - `long`: Longitude coordinate.
   These fields must match those specified in `src/utils/markersProps.js`.

   - **Air Quality Monitoring Data**: se as `VUE_APP_MARKERS_COLLECTION_NAME`, this collection stores the air quality data collected by the monitors. The structure of the documents in this collection should adhere to the fields defined in `src/utils/monitorsProps.js`.

3. **Environment Variables and Server Setup**: After setting up your Firebase project and ensuring the correct database structure, you need to configure the environment variables as per the `.env.sample`. Then, execute `yarn serve` to launch the server on port 8080.

## Conclusion

The Air Quality Repository - MoQA Network is a pioneering project that leverages modern technology for environmental monitoring and management. By providing real-time data on air quality, it supports the efforts of technicians and researchers in making informed decisions towards improving environmental health.

## License

This project is released under the GNU General Public License v3.0, promoting transparency, collaboration, and freedom in software use, thereby contributing to the knowledge-sharing culture and continuous development of the project.
