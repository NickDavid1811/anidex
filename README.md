# AniDex

Aplicación multiplataforma para descubrir anime, consultar información detallada y crear una colección personal de favoritos. AniDex obtiene su catálogo desde la API GraphQL de [AniList](https://anilist.co) y está construida con Expo y React Native.

## Funcionalidades

- Consulta de anime en tendencia y rankings destacados.
- Búsqueda por título, género, popularidad y tendencia.
- Fichas con sinopsis, formato, estado, episodios, temporada y puntuación.
- Ruleta para descubrir un anime al azar.
- Favoritos almacenados localmente, con búsqueda, filtros, ordenamiento y opción de deshacer eliminaciones.
- Conexión opcional con una cuenta de AniList mediante OAuth.
- Temas claro, oscuro y automático según el sistema.
- Interfaz adaptable para Android, iOS y web.

## Tecnologías

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) y React Native 0.86
- [Expo Router](https://docs.expo.dev/router/introduction/) para navegación basada en archivos
- TypeScript
- NativeWind y Tailwind CSS
- AniList GraphQL API
- Expo SQLite para persistencia local en plataformas nativas
- Expo SecureStore para almacenar la sesión de AniList en el dispositivo

## Requisitos

- [Bun](https://bun.sh/) instalado
- Un dispositivo físico o emulador compatible con Expo
- Una aplicación de AniList, únicamente si se desea probar el inicio de sesión

## Instalación

1. Clona el repositorio y entra en su directorio:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd anidex
   ```

2. Instala las dependencias:

   ```bash
   bun install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   bunx expo start
   ```

La consulta del catálogo público de AniList no requiere credenciales.

## Configuración de AniList OAuth

Esta configuración es opcional. Se necesita para conectar el perfil del usuario desde la pantalla de ajustes.

1. Crea una aplicación en la sección de desarrolladores de AniList.
2. Configura `anidex://auth/callback` como URL de redirección.
3. Crea un archivo `.env.local` en la raíz del proyecto:

   ```env
   EXPO_PUBLIC_ANILIST_CLIENT_ID=tu_client_id
   ```

4. Genera e instala una development build:

   ```bash
   bun run ios
   # o
   bun run android
   ```

El flujo OAuth no está disponible en Expo Go ni en la versión web. El token de sesión se almacena de forma segura en el dispositivo mediante SecureStore.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `bun run start` | Inicia el servidor de desarrollo de Expo. |
| `bun run android` | Compila y ejecuta la aplicación en Android. |
| `bun run ios` | Compila y ejecuta la aplicación en iOS. |
| `bun run web` | Inicia la aplicación para web. |
| `bun run lint` | Ejecuta ESLint con la configuración de Expo. |
| `bunx tsc --noEmit` | Comprueba los tipos de TypeScript. |

## Estructura del proyecto

```text
src/
├── app/                 # Rutas y pantallas de Expo Router
├── components/          # Componentes compartidos
├── features/
│   ├── anime/           # Catálogo, búsqueda y detalle
│   ├── auth/            # Sesión OAuth de AniList
│   ├── favorites/       # Favoritos y persistencia local
│   └── theme/           # Preferencias de apariencia
└── lib/                 # Clientes e infraestructura compartida
```

La aplicación organiza el código por funcionalidades. Las rutas permanecen en `src/app`, mientras que la lógica de dominio, los hooks, los servicios y los componentes específicos viven en `src/features`.

## Persistencia y datos

Los favoritos se guardan en el dispositivo y no se sincronizan actualmente con la cuenta de AniList. En plataformas nativas se utiliza SQLite, con almacenamiento local de respaldo. La conexión con AniList identifica el perfil del usuario y conserva su sesión, pero no modifica sus listas remotas.

Los títulos, imágenes, descripciones y puntuaciones pertenecen a sus respectivos propietarios y se obtienen mediante la API de AniList. AniDex no está afiliada ni respaldada oficialmente por AniList.

## Estado del proyecto

AniDex se encuentra en desarrollo. Entre las mejoras previstas se encuentran la sincronización de favoritos con AniList, una cobertura de pruebas más amplia y la preparación de builds de distribución.

## Licencia

Consulta el archivo [LICENSE](./LICENSE) para conocer los términos de uso del código.
