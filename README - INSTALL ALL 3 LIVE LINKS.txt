VALLEY STATION CHURCH OF GOD - THREE RECURRING VIMEO LIVE SERVICES

The package is an UPDATE to your existing GitHub-connected Cloudflare Pages site.
It does not automatically publish anything. It includes all three viewer links:

  Sunday School:  https://vimeo.com/event/4206777   (Sunday, 9:30 AM shown on current site)
  Sunday Morning Worship: https://vimeo.com/event/6371376   (Sunday, 11:00 AM confirmed)
  Wednesday Night Bible Study: https://vimeo.com/event/4206787  (Wednesday, 6:30 PM shown on current site)

Because these events are recurring in Vimeo, these SAME Vimeo event links can be reused every week.
This update does not create or change Vimeo events or their schedules.

WHAT THIS ZIP CHANGES
- content/service-links.json: lists all three event links.
- watch/index.html, watch.js, watch.css: displays 3 selectable services and the Vimeo player/backup links.
- index.html: corrects the Sunday Morning Worship time from 10:45 to 11:00 AM.
- .pages.yml: makes the Live Service Links section available in Pages CMS and keeps existing editor sections.

IMPORTANT: THIS IS NOT A WHOLE NEW WEBSITE.
Preserves existing content by NOT including: content/announcements.json,
content/events.json, content/sermons.json, content/livestream.json,
or assets or staff app files.
If you have customized your HOME PAGE or .pages.yml since the previous professional update, back up those files first; uploading this ZIP's versions can overwrite customizations.

UPLOADING THROUGH GITHUB
1. Download this ZIP. In Downloads, right-click > Extract All.
2. Open https://github.com/tjbass2655/valley-station-church-website
3. Click Add file > Upload files.
4. Drag ALL SIX of these items from INSIDE the extracted folder:
   index.html, watch folder, watch.js, watch.css, content folder, .pages.yml
   (and optionally this README if desired).
   Be sure to drag the folders themselves so their paths stay intact.
5. Confirm that content/announcements.json, content/events.json, content/sermons.json
   are NOT being deleted or replaced. Do not upload this ZIP file as a single file.
6. Click Commit changes to main. Cloudflare should redeploy automatically.
7. Visit https://myvscog.org/watch/ to verify the three service buttons.

AFTERWARDS
Open https://app.pagescms.org > valley-station-church-website >
Live Service Links (All 3 Services) to edit any of these links later.
No weekly edits are needed while the Vimeo recurring event URLs stay the same.

IF AN EMBEDDED PLAYER DOES NOT WORK
The Watch Live page includes an Open on Vimeo button for each event, which should
work whenever the Vimeo viewer link is public and accessible.
For displaying Vimeo's official player on the page, go into the corresponding
recurring event > Embed, copy its official iframe embed code, and paste it into
its corresponding optional embed field in Pages CMS. Check Vimeo embedding privacy
so that myvscog.org and www.myvscog.org are allowed.

IMPORTANT: Never paste Vimeo's private stream key into the website or GitHub.
