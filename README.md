📌 Endpoints de Autenticación (/auth)
1️⃣ Registrar un Usuario
Método: POST
URL:
http://127.0.0.1:3000/studentSystem/v1/auth/register
Body (JSON):
{
  "name": "Juan",
  "surname": "Pérez",
  "username": "juanperez",
  "password": "securepassword",
  "email": "juan@example.com",
  "phone": "123456789"
}
Respuesta esperada (Éxito):
{
  "success": true,
  "message": "Usuario registrado exitosamente"
}
2️⃣ Iniciar Sesión
Método: POST
URL:
http://127.0.0.1:3000/studentSystem/v1/auth/login
Body (JSON):
{
  "email": "juan@example.com",
  "password": "securepassword"
}
Respuesta esperada (Éxito):
{
  "success": true,
  "message": "Inicio de sesión exitoso"
}
📌 Endpoints de Usuarios (/user)
3️⃣ Obtener Todos los Usuarios
Método: GET
URL:
http://127.0.0.1:3000/studentSystem/v1/user?limits=5&from=0
Respuesta esperada:
{
  "success": true,
  "total": 10,
  "users": [
    {
      "uid": "id(la que sale en la db)",
      "name": "Juan",
      "email": "juan@example.com",
      "role": "STUDENT_ROLE"
    }
  ]
}
4️⃣ Obtener un Usuario por ID
Método: GET
URL:
http://127.0.0.1:3000/studentSystem/v1/user/findUser/:uid
Ejemplo de respuesta:
{
  "success": true,
  "user": {
    "uid": "id(la que sale en la db)",
    "name": "Juan",
    "email": "juan@example.com",
    "role": "STUDENT_ROLE"
  }
}
5️⃣ Actualizar Información del Usuario
Método: PATCH
URL:
http://127.0.0.1:3000/studentSystem/v1/user/updateUser/:uid
Body (JSON):
{
  "name": "Juan Carlos",
  "surname": "Pérez López",
  "phone": "987654321"
}
Respuesta esperada:
{
  "success": true,
  "message": "Perfil actualizado exitosamente"
}
6️⃣ Actualizar Contraseña
Método: PATCH
URL:
http://127.0.0.1:3000/studentSystem/v1/user/updatePassword/:uid
Body (JSON):
{
  "newPassword": "newsecurepassword"
}
Respuesta esperada:
{
  "success": true,
  "message": "Contraseña actualizada"
}
7️⃣ Eliminar un Usuario
Método: DELETE
URL:
http://127.0.0.1:3000/studentSystem/v1/user/deleteUser/:uid
Respuesta esperada:
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
📌 Endpoints de Cursos (/user)
8️⃣ Asignar un Curso a un Estudiante
Método: POST
URL:
http://127.0.0.1:3000/studentSystem/v1/user/assignCourse/:uid
Body (JSON):
{
  "courseName": "Programación en JavaScript"
}
Respuesta esperada:
{
  "success": true,
  "message": "Curso asignado exitosamente"
}
9️⃣ Obtener los Cursos de un Estudiante
Método: GET
URL:
http://127.0.0.1:3000/studentSystem/v1/user/getCourses/:uid
Respuesta esperada:
{
  "success": true,
  "courses": ["Matemáticas", "Historia"]
}
🔟 Editar un Curso (Actualizar el Nombre)
Método: PATCH
URL:
http://127.0.0.1:3000/studentSystem/v1/user/editCourse
Body (JSON):
{
  "oldCourseName": "(el que previamente se asigno)",
  "newCourseName": "(el nuevo que se va a poner)"
}
Respuesta esperada:
{
  "success": true,
  "message": "Curso actualizado correctamente"
}
1️⃣1️⃣ Eliminar un Curso (Desasignar a los Estudiantes)
Método: DELETE
URL:
http://127.0.0.1:3000/studentSystem/v1/user/deleteCourse
Body (JSON):
{
  "courseName": "(curso previamente agregado)"
}
Respuesta esperada:
{
  "success": true,
  "message": "Curso eliminado correctamente y desasignado de los estudiantes"
}
