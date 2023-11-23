import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();

  // Obtener el channel
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  // Obtener el miembro mediante el serverId y el profileId
  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile?.id,
    },
  });

  if (!channel || !member) {
    redirect("/");
  }

  // Comprobar que exista el perfil (este logueado)
  if (!profile) {
    return redirectToSignIn();
  }

  // Vista del channel / conversation
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      {/* Header */}
      <ChatHeader
        serverId={channel.serverId}
        name={channel.name}
        type={"channel"}
        // Extra: Le paso el icono del tipo de channel
        icon={channel.type}
      />
    </div>
  );
};

export default ChannelIdPage;
