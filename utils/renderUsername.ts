export enum RenderUsernameOptions {
  Full = "full",
  UsernameOnly = "username",
  DiscriminatorOnly = "discriminator",
}
export const renderUsername = (
  user?: {
    username: string;
    discriminator: string;
  } | null,
  option: RenderUsernameOptions = RenderUsernameOptions.Full
) => {
  if (!user) return "";
  const { username, discriminator } = user;
  if (discriminator === "0") {
    // switch (option) {
    //   case RenderUsernameOptions.UsernameOnly:
    //     return username;
    //   case RenderUsernameOptions.DiscriminatorOnly:
    //     return "";
    //   default:
    //     return `@${username}`;
    // }
    if (option === RenderUsernameOptions.DiscriminatorOnly) return '';
    return `@${username}`;
  }
  if (option === RenderUsernameOptions.UsernameOnly) return username;
  if (option === RenderUsernameOptions.DiscriminatorOnly) return `#${discriminator}`;
  return `${username}#${discriminator}`;
};
