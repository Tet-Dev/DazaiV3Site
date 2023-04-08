import { Navbar } from "../../components/Navbar";

export const privacyPage = () => {
  return (
    <div
      className={`prose mx-auto prose-invert py-16 prose-headings:text-indigo-500 font-wsans prose-headings:font-poppins`}
    >
        <Navbar />
      <h1>Privacy Policy for Dazai</h1>
      <p>
        Dazai is a Discord bot that allows users to customize their own
        backgrounds and provides generative features. This privacy policy
        explains what data Dazai collects, how it is used, and how it is stored.
      </p>

      <h2>Data Collection</h2>
      <p>
        Dazai collects user-submitted data, such as images and commands
        submitted via our website or Discord. This data is used to provide
        generative features and for debugging and analytics purposes.
      </p>

      <h2>Purpose of Data Collection</h2>
      <p>
        The data collected by Dazai is used to create generative features, such
        as allowing users to customize their own backgrounds. This data is also
        used for debugging and analytics purposes, which helps us improve
        Dazai's functionality and performance.
      </p>

      <h2>Data Access</h2>
      <p>
        Only the bot owner has access to the data collected by Dazai. No third
        parties have access to this data unless required, for example, when the
        bot generates a rank card with a user-provided background that exceeds
        the file limit and needs to be uploaded to a file hosting service.
      </p>

      <h2>Data Storage</h2>
      <p>
        The data collected by Dazai is stored on a MongoDB instance separate
        from the bot server. We take measures to ensure the security of this
        data, including password protection.
      </p>

      <h2>Data Deletion</h2>
      <p>
        Users can request that their data be deleted by contacting the bot owner
        via DM on Discord (
        <a href="https://discord.com/users/295391243318591490">Tet#6000</a>) or{" "}
        <a href="mailto:tet@tet.moe">email</a>. If the bot is shut down or no
        longer in use, user data will remain until it is deleted during a
        cleanup process.
      </p>

      <h2>Additional Information</h2>
      <p>
        Users should be aware that their data is used for generative features,
        debugging, and analytics purposes. If any changes are made to Dazai's
        data practices, this privacy policy will be updated accordingly.
      </p>
    </div>
  );
};
export default privacyPage;
