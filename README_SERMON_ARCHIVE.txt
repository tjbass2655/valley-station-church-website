VALLEY STATION CHURCH OF GOD | SERMON ARCHIVE UPGRADE

WHAT CHANGES
- Home page automatically displays the SIX most recent sermons instead of three.
- A "View All Sermons" button appears below the homepage Recent Sermons section.
- /sermons/ shows the complete sermon library, organized by year and date.
- Visitors can search sermon titles, scripture references, and descriptions.
- Visitors can filter by year, reverse sort order, and show more results.
- Each message opens its own Vimeo recording link when supplied.

WHAT DOES NOT CHANGE
- NO index.html replacement. Your current homepage, slideshow, theme, ministry boxes, and service schedule remain untouched.
- NO changes to content/sermons.json. Your currently posted sermons are preserved.
- NO changes to .pages.yml. Continue entering sermons under "Sermons and Messages" in Pages CMS.
- NO changes to church giving, livestreams, announcements, or events.

TO INSTALL ON YOUR EXISTING GITHUB/CLOUDFLARE SITE
1. Extract the ZIP file.
2. Go to: https://github.com/tjbass2655/valley-station-church-website
3. Before replacing the existing updates.js, open it in GitHub and check that it still contains "slice(0,3)" in renderSermons. If it has other recent customizations, stop and merge them rather than replacing it.
4. Select Add file > Upload files, drag the extracted "updates.js" AND the entire "sermons" folder into the upload area. They must appear in the ROOT of the repository, not inside a new parent folder.
5. Commit the changes to branch "main". Cloudflare Pages should deploy the update automatically.
6. Visit https://myvscog.org/#news and look for up to SIX recent sermons and the "View All Sermons" button.
7. Visit https://myvscog.org/sermons/ to check the archive.

TO ADD MESSAGES IN THE FUTURE
1. Sign in to https://app.pagescms.org/
2. Open valley-station-church-website > Sermons and Messages.
3. Click Add an item. Enter a sermon title, date, scripture, summary, and INDIVIDUAL recorded sermon Vimeo link (not the recurring live event link).
4. Click Save. Pages CMS writes to content/sermons.json and Cloudflare updates both the homepage and archive.
5. Newest SIX appear on the homepage. EVERY saved sermon (with a title) appears in the archive.

NOTE
When the library has no sermons yet, the archive displays a helpful message until you add them. Viewers can still reach Watch Live.
The archive is generated dynamically from the existing single list of sermons. No additional Pages CMS configuration or archive database is needed.
