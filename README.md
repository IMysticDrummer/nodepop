# nodepop
Práctica de desarrollo backend para keepcoding web13. 
Portal de anuncios de compra-venta de segunda mano, renderizado desde servidor.

# PRERREQUISITOS PARA LA PRÁCTICA
## Clonar el repositorio en local
## Instalar dependencias
No olvidar instalar las dependencias con el comando `npm install`.  
## Base de datos
La base de datos se llamará `nodepop`.  
La colección se llamará `advertisements`.  
Correr el comando node initDB.js.  
El script se encargará de crear los índices necesarios, y subir los anuncios.  
Asegurar que el archivo `anunciosBase.json` está disponible cuando se ha clonado
el repositorio.


# Arranque de la aplicación  
Modo desarrollo en windows: npm run devWin  
Modo desarrollo en plataformas linux: npm run dev  
Arranque en producción: npm start  

# Uso del API
## Propósito
Este API devuelve el listado de anuncios de Nodepop en formato JSON, compuesto por la clave `results`, que cotiene un array de objetos.  
Los campos a devolver se pueden seleccionar (ver la sección *peticiones al api*), aunque por defecto son:  
- _id: del artículo en la base de datos
- nombre (del artículo)
- venta: indica si el artículo está en venta o si alguién está buscando ese artículo
- precio
- foto: nombre del archivo de la foto del artículo, que se puede obtener de ...
- tags: array con el/los tags de tipo asociados al artículo.
## Peticiones al api
**Listado completo de anuncios**  
`http://localhost:3000/api`

**Filtros permitidos**  
Sobre la dirección anterior se permiten los siguientes
filtros en línea:  

- nombre=*texto* --> búsqueda por el nombre del artículo  
Como **mejora**, el texto se buscará en el campo completo
del nombre, no sólo por la palabra con la que empieza.  
Además, buscará patron, por lo que no hace falta poner
la palabra completa. Esto permitirá mejorar la experiencia de búsqueda del utilizador en la página web, y de las
solicitudes hechas desde el API, con búsquedas más abiertas.  
*Este campo es insensible a búsqueda en mayúculas o minúsculas.*   
*Ejemplo:* `nombre=pho` devolverá tanto iPhone, como mobile phone, como phonetic.  
- venta=(*true* o *false*) --> búsqueda de artículos en venta (*true*) o de artículos que se buscan (*false*).  
Admite tanto valores true y false, como 1 y 0.
- tag=*texto* --> texto a buscar entre los tags de los anuncios  
  - Sólo hay permitidos 4 tags:
    - lifestyle
    - mobile
    - motor
    - work  

  *Este campo es insensible a búsqueda en mayúculas o minúsculas*, pero **requiere la palabra exacta**.
- precio=*cadena* --> Busca por rangos de precio. El formato de la *cadena* es (siempre sin espacios):
  - *number* --> P.e: 50 --> Busca los articulos de precio exacto
  - *number*- --> P.e: 30- --> Busca los artículos a partir del precio 30
  - *number*-*number* --> P.e: 20-100 --> Busca los artículos de precio a partir de 20 y hasta 100 incluido
  - -*number* --> P.e: -60 --> Busca los artículos de precio hasta 60  
  
  **nota**: El número del precio sólo está limitado a que sea un número convertible a integer.
  Cualquier cifra integer es permitida.  
  Si se introduce una cifra con punto o coma, se
  tendrá en cuenta sólo la parte entera.   

**Otros modificadores**  
Sobre la dirección principal, y de la misma forma que se indican los filtros, se pueden aplicar otros modificadores a la consulta.
- **Paginación**
  - skip=*number* --> Inidica cuantos de los resultados obtenidos de la base de datos saltarse en el resultado
  - limit=*number* --> Indica cuantos resultados se deben devolver
- **Ordenación**  
  - sort=*campo* --> Indica por qué campo realizar la ordenación de los resultados. Los campos posibles son:
    - nombre
    - precio
    - venta
- **Selección de campos a devolver**
  - fields=*cadena* --> la cadena indica los campos a presentar, separdos por `+`. Si no se desea el _id de la base de datos, añadir `%20-_id`.  
  Ejemplo:  
  `http://localhost:3000/api/?fields=nombre+precio%20-_id`  
  Esto devolverá el listado de artículos sólo con los campos nombre y precio.  






