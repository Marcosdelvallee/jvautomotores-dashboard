# Instrucciones para Habilitar RLS

Como no tenemos acceso directo a la línea de comandos de Supabase desde aquí, necesitas ejecutar el script SQL manualmente en tu panel de Supabase.

1.  Ve a tu proyecto en [Supabase](https://supabase.com/dashboard).
2.  En el menú lateral izquierdo, haz clic en **SQL Editor**.
3.  Haz clic en **New Query**.
4.  Copia el contenido del archivo `RLS_FIX.sql` (o el código de abajo) y pégalo en el editor:

    ```sql
    alter table vehicles enable row level security;
    ```

5.  Haz clic en el botón **Run** (o presiona `Ctrl + Enter`).
6.  Deberías ver un mensaje de éxito ("Success") en la parte inferior.

## Verificación

Para asegurarte de que funcionó:

1.  Ve al **Table Editor** en el menú lateral.
2.  Selecciona la tabla `vehicles`.
3.  En la parte superior derecha de la tabla, deberías ver un escudo o indicador que dice **RLS** (generalmente en verde o con un candado cerrado). Si antes estaba desactivado, ahora debería estar activo.
