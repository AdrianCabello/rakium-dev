import { environment } from '../../../environments/environment';

/**
 * ID del cliente en rakium-be cuyos proyectos se muestran en la sección "Casos de Éxito".
 * Los proyectos se obtienen vía GET /projects/client/:clientId/public
 */
export const RAKIUM_CLIENT_ID = environment.rakiumClientId;
