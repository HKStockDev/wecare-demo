/** Resolve a demo avatar path from a display name. */
const AVATAR_BY_NAME: Record<string, string> = {
  "john doe": "/images/avatars/john.jpg",
  john: "/images/avatars/john.jpg",
  "wecare admin": "/images/avatars/admin.jpg",
  admin: "/images/avatars/admin.jpg",
  "sarah johnson": "/images/avatars/sarah.jpg",
  sarah: "/images/avatars/sarah.jpg",
  "michael chen": "/images/avatars/michael.jpg",
  michael: "/images/avatars/michael.jpg",
  "emma wilson": "/images/avatars/emma.jpg",
  emma: "/images/avatars/emma.jpg",
  "james brown": "/images/avatars/james.jpg",
  james: "/images/avatars/james.jpg",
  "olivia martinez": "/images/avatars/olivia.jpg",
  olivia: "/images/avatars/olivia.jpg",
  anna: "/images/avatars/anna.jpg",
  lisa: "/images/avatars/lisa.jpg",
  david: "/images/avatars/david.jpg",
};

export function avatarForName(name?: string | null, fallback?: string | null) {
  if (fallback) return fallback;
  if (!name) return "/images/avatar-default.svg";
  const key = name.trim().toLowerCase();
  return AVATAR_BY_NAME[key] || AVATAR_BY_NAME[key.split(" ")[0]] || "/images/avatar-default.svg";
}
