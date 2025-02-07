# Backend Reqwest Flow App

## Project Description

This is a test project for **Ryght**, designed as a web platform where the frontend interacts with the backend to process user requests related to parent and child organizations.

### Key Features:

- The system operates within a **parent organization**, where users can select child organizations and send requests to them.
- The **chat component** allows users to enter questions and associate them with specific organizations before sending them to the backend.
- API requests follow the **Swagger** format (`https://api-dev.ryght.ai/swagger/swagger-ui/index.html#/`).
- The backend (absent in this test environment) is supposed to return responses, but **mock responses** are used to simulate expected behavior.
- The application supports both **real API requests (which fail due to the absence of the backend)** and **mock responses for testing interactions**.
- The response structure follows the provided Swagger documentation.

### How It Works:

1. The user interacts with the parent organization and selects child organizations.
2. The selected organizations and user queries are sent to the backend in a predefined request format.
3. If the backend were functional, it would return structured responses. Since the backend is unavailable, **mock responses** simulate the expected behavior.
4. The system logs real API calls, which result in errors, ensuring that the API format remains valid.

### Technologies Used:

- **React & TypeScript** (Frontend)
- **React Flow** for dynamic visualization of organizations and chat interactions
- **Mock API responses** for testing request flows
- **Swagger-based API request formatting**

### API Request Example:

Example of a request sent to the backend via the frontend:

```json
POST /v1/conversations
Content-Type: application/json

{
  "conversationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "type": "BASIC",
  "collectionIds": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ],
  "documentIds": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ],
  "aiTagIds": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ],
  "folderIds": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ],
  "noteIds": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ],
  "defaultCollection": true,
  "copilotId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "prompt": {
    "question": "string",
    "template": "Describe variant {{variant}}! Using this abstracts {{abstracts}}",
    "keyWords": {
      "additionalProp1": {},
      "additionalProp2": {},
      "additionalProp3": {}
    },
    "attachments": [
      {
        "imageId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }
    ]
  },
  "limit": 10,
  "score": 1,
  "temperature": 0
}
```

### Expected Backend Response:

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "question": "string",
  "answer": "string",
  "createdAt": "2025-02-05T22:51:46.465Z",
  "collections": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string"
    }
  ],
  "documents": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string"
    }
  ],
  "embeddings": [
    {
      "content": "string",
      "cosineDistance": "string",
      "document": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "metadata": {
          "title": "string",
          "documentAbstract": "string",
          "authors": [
            {
              "firstName": "string",
              "lastName": "string"
            }
          ],
          "doi": "string",
          "extraFields": {
            "additionalProp1": {},
            "additionalProp2": {},
            "additionalProp3": {}
          },
          "publishDate": "2025-02-05T22:51:46.465Z"
        }
      }
    }
  ],
  "attachments": [
    {
      "imageId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }
  ]
}
```

This example demonstrates how requests are structured and sent via the frontend, as well as how the backend should return structured responses.
