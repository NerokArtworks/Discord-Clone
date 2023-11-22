import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Debe recibir el serverId para cargar siempre directamente el canal "general"
interface ServerIdProps {
  params: {
    serverId: string;
  }
};

// Asignamos la interfaz y los parametros
const ServerIdPage = async ({
  params
}: ServerIdProps) => {
  const profile = await currentProfile();

  // Comprobar que exista el perfil (este logueado)
  if (!profile) {
    return redirectToSignIn();
  }

  // Obtener servidor pasando el serverId de los params, filtrando ademas por profile.id de los miembros (que el usuario este en el server)
  // Include de los channels para recoger los channels del server filtrando por el "general"
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
    include: {
      channels: {
        where: {
          name: 'general'
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });

  // Obtener el channel
  const initialChannel = server?.channels[0];

  // Esto no debe ocurrir nunca pues esta controlado que nunca se pueda borrar el channel "general"
  if (initialChannel?.name !== "general") {
    return null;
  }

  // Redirigir al channel "general" del servidor seleccionado
  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;
