export default {
  soon: 'Coming soon!',
  humidity: 'Humidity',
  temperature: 'Temperature',
  unexpected_error: 'An unexpected error has occurred. Check your connection and try again. If the problem persists, contact support.',
  quantity: 'Quantity',
  reset_zoom: 'Reset zoom',
  data_found: 'Data found',
  showing_data: 'Showing data from all monitors of the period:',
  data: 'Data',
  resume: 'Summary',
  total_of_data: 'Total data',
  total_of_monitors: 'Total monitors',
  on_selected_period: 'in the selected period',
  last_monitors_data: 'Last monitor data',
  select_a_period: 'Select a period to export data',
  loading_data: 'Loading data...',
  not_found_on_period: 'No data found for the selected period',
  documents: 'documents',
  invalid_date_range: 'Invalid date range. Start date must be before end date.',
  not_possible_export_empty: 'Cannot export empty data.',
  alerts: {
    you_must_sign_in: 'You must be logged in to view this page!',
    no_permission: 'You do not have permission to access this page!',
  },
  monitors_relation: 'Monitors summary',
  quantity_of_data: 'Data quantity',
  quantity_of_data_by_monitor: 'Total data or errors by monitor',
  metereological_parameters: 'Meteorological parameters',
  pollutants_parameters: 'Pollutants parameters',
  over_time: 'over time',
  latitude: 'Latitude',
  longitude: 'Longitude',
  name: 'name',
  errors: 'Errors',
  time: {
    min: 'min',
    hour:'hour',
    hours:'hours',
  },
  components: {
    header: {
      hi: 'Hello,',
      login: 'Login',
      logout: 'Logout',
      signup: 'Sign Up',
      profile: 'Profile',
    },
    table_paginated: {
      export: 'Export',
      first: 'First',
      before: 'Previous',
      next: 'Next',
      last: 'Last',
      until: 'until',
      page: 'Page',
      of: 'of',
      without_data_to_show: 'No data to display',
      type_to_search: 'Type to search',
    }
  },
  routes: {
    profile: {
      title: 'Profile',
      name: 'Name',
      change_password: 'You can change your password',
      placeholder_name: 'Enter your name',
      update_your_password: 'Update your password',
      inform_your_name: 'Inform your name!',
      update_your_name: 'Update your name',
      new_name: 'Enter the new name',
      new_password: 'Enter the new password',
      your_email: 'Enter your email',
      last_password: 'Enter the current password',
      save_changes: 'Save changes',
    },
    admin : {
      title: 'Admin',
    },
    map: {
      title: 'Map',
    },
    home: {
      title: 'Data Repository',
      subtitle: 'Air Quality Monitoring - MoQA Network',
      credits: "Image by",
    },
    not_found: {
      title: 'Page Not Found',
      subtitle: 'The page you are looking for does not exist',
      action: 'Return to the home page',
    },
    update_monitors : {
      title: 'Update Monitors',
    },
    dashboard: {
      title: 'Dashboard',
    },
    data: {
      title: 'Export Data',
      initial_date: 'Start Date',
      final_date: 'End Date',
      initial_hour: 'Start Time',
      final_hour: 'End Time',
      search: 'Search',
    },
    analyze: {
      title:'Analysis',
    },
    login: {
      title: 'Access Your Account',
      email: 'Email',
      email_placeholder: 'Enter your email',
      password: 'Password',
      password_placeholder: 'Enter your password',
      action: 'Login',
      errors: {
        "auth/claims-too-large": "Token size exceeded the maximum limit of 1 Megabyte.",
        "auth/email-already-exists": "Email address is already in use by another account.",
        "auth/id-token-expired": "Authentication token has expired.",
        "auth/id-token-revoked": "Authentication token has been revoked.",
        "auth/insufficient-permission": "User does not have permission to perform the requested action.",
        "auth/internal-error": "Authentication server encountered an unexpected error while processing the request.",
        "auth/invalid-argument": "An invalid argument was provided to a method.",
        "auth/invalid-claims": "Custom claims attributes are invalid.",
        "auth/invalid-continue-uri": "Return address must be a valid URL string.",
        "auth/invalid-creation-time": "Creation time must be a valid UTC date string.",
        "auth/invalid-credential": "Credential has expired or is poorly formatted.",
        "auth/invalid-disabled-field": "Disabled user field is invalid.",
        "auth/invalid-display-name": "User name is invalid.",
        "auth/invalid-dynamic-link-domain": "Provided dynamic link domain is not configured or authorized for the current project.",
        "auth/invalid-email": "Email address is poorly formatted.",
        "auth/invalid-email-verified": "Email address is poorly formatted.",
        "auth/invalid-hash-algorithm": "HASH algorithm is not compatible with encryption.",
        "auth/invalid-hash-block-size": "HASH block size is not valid.",
        "auth/invalid-hash-derived-key-length": "Derived key length from HASH is not valid.",
        "auth/invalid-hash-key": "HASH key must have a valid byte buffer.",
        "auth/invalid-hash-memory-cost": "HASH memory cost is not valid.",
        "auth/invalid-hash-parallelization": "HASH parallel load is not valid.",
        "auth/invalid-hash-rounds": "HASH rounds are not valid.",
        "auth/invalid-hash-salt-separator": "SALT separator field must be a valid byte buffer.",
        "auth/invalid-id-token": "Authentication token is not a valid JWT.",
        "auth/invalid-last-sign-in-time": "Last login time must be a valid UTC date string.",
        "auth/invalid-page-token": "The next URL provided in the request is invalid.",
        "auth/invalid-password": "Password is invalid, must be at least 6 characters long.",
        "auth/wrong-password": "Password is invalid for the specified account.",
        "auth/invalid-password-hash": "Password HASH is not valid.",
        "auth/invalid-password-salt": "Password SALT is not valid.",
        "auth/invalid-phone-number": "Phone number must be a valid phone number.",
        "auth/invalid-photo-url": "User photo URL is invalid.",
        "auth/invalid-provider-id": "Provider identifier is not compatible.",
        "auth/invalid-session-cookie-duration": "Session cookie duration must be a valid number in milliseconds, between 5 minutes and 2 weeks.",
        "auth/invalid-uid": "Provided identifier must have a maximum of 128 characters.",
        "auth/invalid-user-import": "User record to be imported is not valid.",
        "auth/maximum-user-count-exceeded": "Maximum allowed number of users to be imported has been exceeded.",
        "auth/missing-android-pkg-name": "An Android app package name must be provided for installation.",
        "auth/missing-continue-uri": "Next URL must be provided in the request.",
        "auth/missing-hash-algorithm": "HASH algorithm and its parameters must be provided for user import.",
        "auth/missing-ios-bundle-id": "An iOS app package name must be provided for installation.",
        "auth/missing-uid": "An identifier is required for the current operation.",
        "auth/missing-oauth-client-secret": "OAuth client secret is required for authorization code flow authentication.",
        "auth/operation-not-allowed": "Provided login provider is disabled for Firebase.",
        "auth/phone-number-already-exists": "Phone number is already in use by another account.",
        "auth/project-not-found": "No project was found.",
        "auth/reserved-claims": "One or more provided custom attributes use reserved words.",
        "auth/session-cookie-expired": "Session cookie has expired.",
        "auth/session-cookie-revoked": "Session cookie has been revoked.",
        "auth/uid-already-exists": "Provided identifier is already in use.",
        "auth/too-many-requests": "Number of requests exceeded the allowed maximum.",
        "auth/unauthorized-continue-uri": "App domain is not in the authorization list.",
        "auth/user-not-found": "No existing user record matches the provided identifier.",
      }
    }
  }
}
