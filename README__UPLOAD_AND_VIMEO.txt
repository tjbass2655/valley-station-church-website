VALLEY STATION CHURCH OF GOD
WEBSITE MANAGER APP + PROFESSIONAL WATCH LIVE UPGRADE

WHAT IS ALREADY WORKING
- Your current website remains https://myvscog.org.
- GitHub and Cloudflare Pages publish changes to the existing project automatically.
- Your announcements, events, and sermons are already editable in Pages CMS.

A. IMMEDIATE 1-CLICK ACCESS TO PAGES CMS (NO UPLOAD NEEDED)
- On Windows: Double-click Valley_Station_Pages_CMS_Desktop_Shortcut.url
  and, if you want, move that shortcut to your desktop.
- Or open the included Valley_Station_CMS_One_Click_App.html in a browser.
- Select 'Open Pages CMS'. Sign in with your existing GitHub account if asked.
- Select the 'valley-station-church-website' project.

B. OPTIONAL CHURCH WEBSITE MANAGER APP AT myvscog.org/staff/
- Download the Church_Website_Manager_App_Only.zip file, then Extract All.
- Open https://github.com/tjbass2655/valley-station-church-website.
- Add file > Upload files and upload the staff folder's contents keeping the
  staff/ directory structure (staff/index.html, manifest, images, sw.js).
- Commit changes. The /staff/ page will go live automatically through Cloudflare.
- Open https://myvscog.org/staff/.
- On iPhone (Safari): Share > Add to Home Screen > Add.
- On Android (Chrome): browser menu > Install app or Add to Home screen.
- On Windows (Edge): ... > Apps > Install this site as an app, if offered.
- This is a launcher app, not a replacement for Pages CMS. Pages CMS and Vimeo
  remain separate secured websites and may ask you to log in.

C. OPTIONAL PROFESSIONAL SITE + WATCH LIVE PAGE UPGRADE
IMPORTANT: This ZIP is an UPGRADE to your existing site, not a new one.
DO NOT DELETE the GitHub repository or Cloudflare project.
DO NOT OVERWRITE OR DELETE these existing files:
- content/announcements.json
- content/events.json
- content/sermons.json
Those store the weekly posts you have already published, and are excluded
from the upgrade ZIP.

1. Download Professional_Church_Website_With_Vimeo_and_Manager.zip.
2. Right click > Extract All. Open the extracted folder.
3. In GitHub, go to your existing valley-station-church-website repository.
4. Add file > Upload files. Upload the UPDATED files and folders INSIDE the ZIP,
   preserving their paths. You are adding watch/ and staff/ and updating the
   root index.html, styles.css and .pages.yml files.
   If GitHub asks to replace matching files, review and confirm the changes.
   If the GitHub web interface does not accept replacements, use the pencil
   editor on each existing file to replace its contents, or ask for help.
5. Commit changes to branch main. Do not change DNS or domain settings.
6. After deployment, open https://myvscog.org/watch/ and
   https://myvscog.org/staff/.

D. VIMEO LIVE LINK, STEP BY STEP
1. Sign in to the church's Vimeo account.
2. Open its recurring or scheduled Live Event.
3. Copy the PUBLIC event/viewer link (usually https://vimeo.com/event/NUMBER).
   This is the URL a church visitor would use, not your production login link.
4. Optionally select Embed > Player only > Responsive > Copy embed code.
   Vimeo may require you to allow myvscog.org and www.myvscog.org as embedding
   domains in your live event settings.
5. Open https://app.pagescms.org and select valley-station-church-website.
6. Select the NEW 'Watch Live (Vimeo)' section.
7. Paste the public link into Vimeo Live Service Link.
8. Optionally paste the Vimeo iframe embed code into the Embed field.
9. Click Save. Cloudflare publishes the change to your existing site.
10. Check https://myvscog.org/watch/ for the embedded player and backup
    'Open on Vimeo' button. Test when broadcasting and when not broadcasting.

Without a real church Vimeo link, the new watch page purposely shows a
welcome message rather than falsely claiming a livestream is playing.

For RECURRING events, use the recurring event's Vimeo link so you do not have
 to change the website every Sunday, provided your Vimeo event uses that link.

NOTE: Update or confirm the service times, contact information and ministry
wording on the site before inviting the public to rely on those details.
