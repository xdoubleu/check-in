/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export type paths = {
  "/all-locations": {
    get: {
      responses: {
        /** OK */
        200: {
          schema: definitions["Location"][];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/all-locations/checkins/day": {
    get: {
      parameters: {
        query: {
          /** Location IDs */
          ids: string[];
          /** ReturnType ('raw' or 'csv') */
          returnType: string;
          /** Date (format: 'yyyy-MM-dd') */
          date: string;
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["CheckInsLocationEntryRaw"][];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Not Found */
        404: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/all-locations/checkins/range": {
    get: {
      parameters: {
        query: {
          /** Location IDs */
          ids: string[];
          /** ReturnType ('raw' or 'csv') */
          returnType: string;
          /** StartDate (format: 'yyyy-MM-dd') */
          startDate: string;
          /** EndDate (format: 'yyyy-MM-dd') */
          endDate: string;
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["CheckInsLocationEntryRaw"][];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Not Found */
        404: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/auth/refresh": {
    get: {
      responses: {
        /** OK */
        200: unknown;
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/auth/signin": {
    post: {
      parameters: {
        body: {
          /** SignInDto */
          signInDto: definitions["SignInDto"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["User"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/auth/signout": {
    get: {
      responses: {
        /** OK */
        200: unknown;
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/checkins": {
    post: {
      parameters: {
        body: {
          /** CreateCheckInDto */
          createCheckInDto: definitions["CreateCheckInDto"];
        };
      };
      responses: {
        /** Created */
        201: {
          schema: definitions["CheckInDto"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Not Found */
        404: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/current-user": {
    get: {
      responses: {
        /** OK */
        200: {
          schema: definitions["User"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/locations": {
    get: {
      parameters: {
        query: {
          /** Page to fetch */
          page?: number;
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["PaginatedLocationsDto"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
    post: {
      parameters: {
        body: {
          /** CreateLocationDto */
          createLocationDto: definitions["CreateLocationDto"];
        };
      };
      responses: {
        /** Created */
        201: {
          schema: definitions["Location"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Conflict */
        409: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/locations/{id}": {
    get: {
      parameters: {
        path: {
          /** Location ID */
          id: string;
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["Location"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Not Found */
        404: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
    delete: {
      parameters: {
        path: {
          /** Location ID */
          id: string;
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["Location"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Not Found */
        404: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
    patch: {
      parameters: {
        path: {
          /** Location ID */
          id: string;
        };
        body: {
          /** UpdateLocationDto */
          updateLocationDto: definitions["UpdateLocationDto"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["Location"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Conflict */
        409: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/locations/{id}/checkins": {
    get: {
      responses: {
        /** OK */
        200: {
          schema: definitions["CheckInDto"][];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/locations/{locationId}/checkins/{checkInId}": {
    delete: {
      parameters: {
        path: {
          /** Location ID */
          locationId: string;
          /** Check-In ID */
          checkInId: number;
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["CheckInDto"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Not Found */
        404: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/schools": {
    get: {
      parameters: {
        query: {
          /** Page to fetch */
          page?: number;
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["PaginatedSchoolsDto"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
    post: {
      parameters: {
        body: {
          /** SchoolDto */
          schoolDto: definitions["SchoolDto"];
        };
      };
      responses: {
        /** Created */
        201: {
          schema: definitions["School"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Conflict */
        409: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/schools/{id}": {
    delete: {
      parameters: {
        path: {
          /** School ID */
          id: number;
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["School"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Not Found */
        404: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
    patch: {
      parameters: {
        path: {
          /** School ID */
          id: number;
        };
        body: {
          /** SchoolDto */
          schoolDto: definitions["SchoolDto"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["School"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Conflict */
        409: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/state": {
    get: {
      responses: {
        /** OK */
        200: {
          schema: definitions["State"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
    patch: {
      parameters: {
        body: {
          /** StateDto */
          stateDto: definitions["StateDto"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["State"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/users": {
    get: {
      parameters: {
        query: {
          /** Page to fetch */
          page?: number;
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["PaginatedUsersDto"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
    post: {
      parameters: {
        body: {
          /** CreateUserDto */
          createUserDto: definitions["CreateUserDto"];
        };
      };
      responses: {
        /** Created */
        201: {
          schema: definitions["User"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Conflict */
        409: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/users/{id}": {
    get: {
      parameters: {
        path: {
          /** User ID */
          id: string;
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["User"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Not Found */
        404: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
    delete: {
      parameters: {
        path: {
          /** User ID */
          id: string;
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["User"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Not Found */
        404: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
    patch: {
      parameters: {
        path: {
          /** User ID */
          id: string;
        };
        body: {
          /** UpdateUserDto */
          updateUserDto: definitions["UpdateUserDto"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["User"];
        };
        /** Bad Request */
        400: {
          schema: definitions["ErrorDto"];
        };
        /** Unauthorized */
        401: {
          schema: definitions["ErrorDto"];
        };
        /** Conflict */
        409: {
          schema: definitions["ErrorDto"];
        };
        /** Internal Server Error */
        500: {
          schema: definitions["ErrorDto"];
        };
      };
    };
  };
  "/ws": {
    get: {
      parameters: {
        body: {
          /** SubscribeMessageDto */
          subscribeMessageDto: definitions["SubscribeMessageDto"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["LocationUpdateEvent"];
        };
      };
    };
  };
};

export type definitions = {
  CheckInDto: {
    capacity?: number;
    createdAt?: string;
    id?: number;
    locationId?: string;
    schoolName?: string;
  };
  CheckInsLocationEntryRaw: {
    capacities?: { [key: string]: number };
    schools?: { [key: string]: number };
  };
  CreateCheckInDto: {
    schoolId?: number;
  };
  CreateLocationDto: {
    capacity?: number;
    name?: string;
    password?: string;
    timeZone?: string;
    username?: string;
  };
  CreateUserDto: {
    password?: string;
    username?: string;
  };
  ErrorDto: {
    error?: string;
    message?: unknown;
    status?: number;
  };
  Location: {
    available?: number;
    availableYesterday?: number;
    capacity?: number;
    capacityYesterday?: number;
    id?: string;
    name?: string;
    normalizedName?: string;
    timeZone?: string;
    userId?: string;
    yesterdayFullAt?: string;
  };
  LocationUpdateEvent: {
    available?: number;
    availableYesterday?: number;
    capacity?: number;
    capacityYesterday?: number;
    normalizedName?: string;
    yesterdayFullAt?: string;
  };
  PaginatedLocationsDto: {
    data?: definitions["Location"][];
    pagination?: definitions["Pagination"];
  };
  PaginatedSchoolsDto: {
    data?: definitions["School"][];
    pagination?: definitions["Pagination"];
  };
  PaginatedUsersDto: {
    data?: definitions["User"][];
    pagination?: definitions["Pagination"];
  };
  Pagination: {
    current?: number;
    total?: number;
  };
  /** @enum {string} */
  Role: "default" | "manager" | "admin";
  School: {
    id?: number;
    name?: string;
    readOnly?: boolean;
  };
  SchoolDto: {
    name?: string;
  };
  SignInDto: {
    password?: string;
    rememberMe?: boolean;
    username?: string;
  };
  State: {
    isDatabaseActive?: boolean;
    isMaintenance?: boolean;
  };
  StateDto: {
    isMaintenance?: boolean;
  };
  SubscribeMessageDto: {
    normalizedName?: string;
    subject?: definitions["WebSocketSubject"];
  };
  UpdateLocationDto: {
    capacity?: number;
    name?: string;
    password?: string;
    timeZone?: string;
    username?: string;
  };
  UpdateUserDto: {
    password?: string;
    username?: string;
  };
  User: {
    id?: string;
    location?: definitions["Location"];
    role?: definitions["Role"];
    username?: string;
  };
  /** @enum {string} */
  WebSocketSubject: "all-locations" | "single-location";
};

export type operations = {};

export type external = {};
