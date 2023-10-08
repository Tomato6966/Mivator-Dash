import CrossHost from "discord-cross-hosting";
import Hybrid, { ClusterClientData } from "discord-hybrid-sharding";

interface myApp {
    clientMachine?: CrossHost.Client,
    info: Hybrid.ClusterClientData
}
export const myApp = { } as myApp

export const BuildConnection = async () => {
    console.log("BuildConnection")
    if(myApp.clientMachine) return;
    myApp.clientMachine = new CrossHost.Client({
        agent: "dashboard",
        authToken: "test_auth_token",
        host: "localhost",
        port: 3005,
    });
    myApp.clientMachine.on("debug", (d) => console.log("CLIENT MACHINE", d, "\n\n"));
    myApp.clientMachine.connect();
    myApp.clientMachine.on("ready", async (d) => {
        console.log("Client Machine Ready");
        const res = await requestMachine<ClusterClientData>((client:any) => client.cluster.info);
        myApp.info = res[0];
    })
    return 
}

function clusterIdOfShardId(shardId) {
    if(typeof shardId === "undefined" || typeof shardId !== "number" || isNaN(shardId)) return undefined;
    if(Number(shardId) > myApp.info?.TOTAL_SHARDS) return undefined;
    const middlePart = Number(shardId) === 0 ? 0 : Number(shardId) / Math.ceil(myApp.info?.TOTAL_SHARDS / myApp.info?.CLUSTER_COUNT);
    return Number(shardId) === 0 ? 0 : (Math.ceil(middlePart) - (middlePart % 1 !== 0 ? 1 : 0));
}

function clusterIdOfGuildId(guildId) {
    if(!guildId || !/^(?<id>\d{17,20})$/.test(guildId)) return undefined;
    return clusterIdOfShardId(shardIdOfGuildId(guildId));
}

function shardIdOfGuildId(guildId) {
    if(!guildId || !/^(?<id>\d{17,20})$/.test(guildId)) return undefined;
    return Number(BigInt(guildId) >> 22n) % myApp.info?.TOTAL_SHARDS;
}

BuildConnection();

export const requestGuild = async <T>(guildId:string, fn:any, contextData?:Record<string, any>) => {
    const cId = clusterIdOfGuildId(guildId);
    const clusterId = typeof cId === "number" && !isNaN(cId) && cId >= 0 ? cId : undefined;
    if(!clusterId) return undefined;
    const res = await myApp.clientMachine.broadcastEval(fn, { 
        context: { guildId, ...(contextData||{}) }, 
        filter: (machineClient) => machineClient.agent === "bot",
        cluster: clusterId,
    });
    return res[0][0] as T;
}
export const requestMachine = async <T>(fn:any, contextData?:Record<string, any>, clusterId?:number) => {
    const res = await myApp.clientMachine.broadcastEval(fn, { 
        context: { ...(contextData||{}) }, 
        filter: (machineClient) => machineClient.agent === "bot",
        cluster: clusterId,
    });
    return res[0] as T[];
}
