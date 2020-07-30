# Artisthub Server

Servidor de la app Artisthub:
  - Recibe las peticiones HTTP
  - Realiza la conexion a la base de datos
  - Tiene el RUD para usuarios, proveedores y posts.

### Para instalar:
  - Primero clonar el repositorio
  - Ir a la carpeta del nuevo repositorio
  - Instalar todas las dependencias necesarias:

 ```sh
$ cd artisthub_server
$ npm install
```
  - Crear un archivo .env en la raiz del proyecto con los siguientes datos:

| Variable | Ejemplo |
| ------ | ------ |
| PORT | 3000 |
| SECRET | "Secreto1" |
| MONGO_URL | "mongodb://127.0.0.1:27017/artisthub" |

  - Para ejecutar npm start:

 ```sh
$ npm start
```
