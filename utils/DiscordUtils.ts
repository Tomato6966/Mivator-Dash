const cdnUrl = `https://cdn.discordapp.com`;

const cdnPaths = {
    customEmoji: (id) => `${cdnUrl}/emoji/${id}.${hashExtension(id)}`,
    guildIcon: (id, hash) => `${cdnUrl}/icons/${id}/${hash}.${hashExtension(hash)}`,
    guildSplash: (id, hash) => `${cdnUrl}/splashes/${id}/${hash}.${hashExtension(hash)}`,
    guildDiscovery: (id, hash) => `${cdnUrl}/discovery-splashes/${id}/${hash}.${hashExtension(hash)}`,
    guildBanner: (id, hash) => `${cdnUrl}/banners/${id}/${hash}.${hashExtension(hash)}`,
    guildMemberAvatar: (guildId, userId, hash) => `${cdnUrl}/guilds/${guildId}/users/${userId}/avatars/${hash}.${hashExtension(hash)}`,
    userAvatar: (id, hash) => `${cdnUrl}/avatars/${id}/${hash}.${hashExtension(hash)}`,
    userBanner: (id, hash) => `${cdnUrl}/banners/${id}/${hash}.${hashExtension(hash)}`,
    userDefaultAvatar: (index) => `${cdnUrl}/embed/avatars/${index}.png`,
}


export function userAvatar(userId:string, avatarHash:string) {
    if(!avatarHash) return cdnPaths.userDefaultAvatar(Math.floor(Math.random() * 9))
    return cdnPaths.userAvatar(userId, avatarHash);
}

export function guildMemberAvatar(guildId:string, userId:string, avatarHash:string) {
    if(!avatarHash) return cdnPaths.userAvatar(userId, avatarHash);
    return cdnPaths.guildMemberAvatar(guildId, userId, avatarHash);
}

export function guildIcon(guildId:string, guildIconHash:string) {
    if(!guildIconHash) return cdnPaths.userDefaultAvatar(Math.floor(Math.random() * 9))
    return cdnPaths.guildIcon(guildId, guildIconHash);
}

export function animatedHash(hash:string) {
    return hash.startsWith(`a_`);
}

export function hashExtension(hash:string) {
    return animatedHash(hash) ? `gif` : `png`;   
}