import { v4 as uuidbv4 } from "uuid";
import { db } from "@/lib/db";

import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        // Fix si no soy admin mi profile.id no se corresponde con el server.profileId (no soy el creador) Entonces si quiero hacer el update filtrando por serverId y profileId necesito obtener el server.profileId a traves del serverId que ya conozco
        const serverProfile = await db.server.findUnique({
            where: {
                id: params.serverId,
            },
            select: {
                profileId: true,
            },
        });

        if (!serverProfile) {
            return new NextResponse("Server not found", { status: 404 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: serverProfile.profileId,
            },
            data: {
                inviteCode: uuidbv4(),
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.error("[SERVER_ID] Error:", error);
        console.error("[SERVER_ID] Params:", params.serverId);
        return new NextResponse("Internal Error", { status: 500 });
    }

}