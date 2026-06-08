# Futbol World Cup

Juego de futbol 3D para navegador con entrenamiento y multijugador online.

## Controles

- `W/S` o flechas arriba/abajo: avanzar y retroceder.
- `A/D` o flechas izquierda/derecha: girar; en camara lateral mueven sobre la pantalla.
- `Shift izquierdo`: sprint.
- `Q`: pase alto.
- `E`: pase.
- `Espacio`: remate cargable.
- `C`: cambiar camara.
- `P`: activar o desactivar Pro mode.
- `M`: sonido ambiente.
- `Escape`: volver o abrir/cerrar la room, segun el modo.

En celular aparecen joystick, sprint, camara, sonido y los tres botones de tiro.

## Multijugador

El frontend se conecta por defecto a:

```text
https://futbol-fun-server.onrender.com
```

La partida usa servidor autoritativo: el navegador envia controles y tiros, mientras el
servidor calcula jugadores, pelota, rebotes, goles, saques y arqueros. El jugador local
se predice inmediatamente y los estados remotos se suavizan entre snapshots.

## Nota tecnica

El juego usa Three.js desde CDN, por lo que necesita internet la primera vez que se abre.

El fondo del menu utiliza una captura del estadio generado por el propio juego.
