# AI Editor

## Agent Service

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **REST API**           | Error Handling                      |   [x]   |
|                        | Exception Logging                   |   [x]   |
|                        | Swagger API Documentation           |   [x]   |
|                        | HATEOAS                             |   [x]   |
|                        | JWT Middleware                      |   [x]   |
| **Database**           | MongoDB                             |   [x]   |
|                        | Mongoose (ODM)                      |   [x]   |
|                        | Automatic backup                    |   [ ]   |
| **Vector Database**    | Qdrant                              |   [x]   |
|                        | Upsert                              |   [x]   |
|                        | Delete                              |   [x]   |
|                        | Search                              |   [x]   |
|                        | Automatic backup                    |   [ ]   |
| **Vector Embedding**   | Model Orchestrator                  |   [x]   |
|                        | all-MiniLM-L6-v2                    |   [x]   |
| **LLM**                | Model Orchestrator                  |   [ ]   |
|                        | gpt-4o-mini                         |   [x]   |
|                        | gemini-2.0-flash-exp                |   [ ]   |
|                        | fine-tuned gpt2                     |   [ ]   |
| **Message Broker**     | Rabbitmq                            |   [x]   |
|                        | Choreographed sagas                 |   [ ]   |
| **Websocket**          | Server                              |   [x]   |
|                        | Events                              |   [x]   |
|                        | MessagePack                         |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## Auth Service

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **REST API**           | Error Handling                      |   [x]   |
|                        | Exception Logging                   |   [x]   |
|                        | Swagger API Documentation           |   [x]   |
|                        | HATEOAS                             |   [x]   |
|                        | JWT Middleware                      |   [x]   |
| **Database**           | MongoDB                             |   [x]   |
|                        | Mongoose (ODM)                      |   [x]   |
|                        | Automatic backup                    |   [ ]   |
| **Message Broker**     | Rabbitmq                            |   [x]   |
|                        | Choreographed sagas                 |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## Payment Service

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **REST API**           | Error Handling                      |   [x]   |
|                        | Exception Logging                   |   [x]   |
|                        | Swagger API Documentation           |   [x]   |
|                        | HATEOAS                             |   [x]   |
|                        | JWT Middleware                      |   [x]   |
| **Payment**            | Stripe                              |   [x]   |
| **Database**           | MongoDB                             |   [x]   |
|                        | Mongoose (ODM)                      |   [x]   |
|                        | Automatic backup                    |   [ ]   |
| **Message Broker**     | Rabbitmq                            |   [x]   |
|                        | Choreographed sagas                 |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## Docs Service

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **REST API**           | Error Handling                      |   [x]   |
|                        | Exception Logging                   |   [x]   |
|                        | Swagger API Documentation           |   [x]   |
|                        | HATEOAS                             |   [x]   |
| **Database**           | MongoDB                             |   [x]   |
|                        | Mongoose (ODM)                      |   [x]   |
|                        | Automatic backup                    |   [ ]   |
| **Message Broker**     | Rabbitmq                            |   [x]   |
|                        | Choreographed sagas                 |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## Email Service

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **Email**              | Gmail                               |   [ ]   |
| **Database**           | MongoDB                             |   [x]   |
|                        | Mongoose (ODM)                      |   [x]   |
|                        | Automatic backup                    |   [ ]   |
| **Message Broker**     | Rabbitmq                            |   [x]   |
|                        | Choreographed sagas                 |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## GPT2 Service

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **LLM**                | Fine-tuning                         |   [ ]   |
|                        | Sample data                         |   [ ]   |
|                        | Generate response                   |   [x]   |
| **Message Broker**     | Rabbitmq                            |   [x]   |
|                        | Choreographed sagas                 |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## App Client

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **Framwork**           | React                               |   [x]   |
| **Routing**            | React-router                        |   [x]   |
| **Styling**            | Tailwindcss                         |   [x]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## App Desktop

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **Framwork**           | React                               |   [x]   |
|                        | Vite                                |   [x]   |
|                        | Electron                            |   [x]   |
| **Routing**            | React-Router                        |   [x]   |
| **State Management**   | React-Redux                         |   [x]   |
| **Styling**            | Tailwindcss                         |   [x]   |
| **Editor**             | Monaco Editor                       |   [x]   |
| **Editor Tabs**        |                                     |   [x]   |
| **Explorer**           |                                     |   [x]   |
| **Search**             |                                     |   [x]   |
| **Terminal**           |                                     |   [x]   |
| **Terminal Tabs**      |                                     |   [x]   |
| **Keyboard Shortcuts** |                                     |   [x]   |
| **Extensions**         |                                     |   [ ]   |
| **AI Chat**            |                                     |   [x]   |
|                        | Ask                                 |   [x]   |
|                        | Agent                               |   [ ]   |
|                        | Research                            |   [ ]   |
| **AI Code Completions**|                                     |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |
