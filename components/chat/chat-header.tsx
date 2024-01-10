import { Hash, Mic, Video } from "lucide-react";

import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { ChannelType } from "@prisma/client";
import { SocketIndicator } from "@/components/socket-indicator";

// El header tiene que recibir el id del servidor, el nombre del channel / conversation y de que tipo es
interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  // Extra: le paso el icono del tipo de channel
  icon?: ChannelType;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
  icon,
}: ChatHeaderProps) => {
  let Icon = Hash;

  if (icon) {
    Icon = iconMap[icon];
  }

  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Icon className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};
