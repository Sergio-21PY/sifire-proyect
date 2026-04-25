"dockerizar" las apis para que sea más facil su levantamiento. 

que el front, pida la ubicación del usuario y asi cargue con la info. del la ubicacion.
y que se muestre en sn joaquin.

la idea es que al inciar el sistema, el front pida al usuario acceder a la ubicación
y asi le muestre el mapa de la comuna y ahi que se ponga a crear reportes.

ajustar el zoom del mapa, que muestre mejor las calles en vez (tener el diametro de un KM como referencia)
opciones de zoom, 500m,  1km, 2km (ideas)

implementar un localStorage en el reporte, poner una marca si fue sincronizado o aun no.
si no fue sincronizado, el service-worker debe tratar de actualizarlo y etiquetarlo como sincronizado.

el funcionario debe tener el service-worker que este consultando siempre, esto en caso de que si alguien
crea un nuevo reporte, a ellos les aparezca y lo visualicen de inmediato(guardar en localStorage del funcionario).

patrones detectados front: circuit en el api-gateway para q el frontend
service-worker para las actualizaciones en seg. plano(patron retry).


ajustar mejor el flujo del sistema, hablo del registro de usuarios,
roles, asignaciones, brigadistas, respetar e implementar patrones de diseños que se prometieron en el informe, testear sistema.

implementar patrones de diseño tanto en el frontend como en el backend.