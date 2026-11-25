VALLEY STATION CHURCH OF GOD - NOVEMBER 25, 2026 SLIDESHOW UPDATE

WHAT THIS UPDATE DOES
Adds three new December announcements, arranged by date:
  * Sunday, Dec 6 at 11:00 AM: Kids Christmas Party in Kids Church
  * Youth are collecting coats, toilet paper, and laundry detergent for Wayside Ministries (undated, displayed before the Dec 21 outreach)
  * Monday, Dec 21 at 9:45 AM: Youth (13+) meet at church to serve at Wayside Ministries; Christmas party afterward

Preserves ALL 11 slides from our most recent saved ordering, including the 3 previously black slides. The 2027 "There Is Still More!" theme stays last. The giving slide remains just before the 2027 theme.

INSTALLATION
1. Open GitHub repo: https://github.com/tjbass2655/valley-station-church-website
2. Back up these two existing files BEFORE replacing them:
   - content/event-slides.json
   - events-slideshow.js
3. At repository root (where index.html is located), choose Add file > Upload files.
4. Upload the *contents* of this ZIP after extraction. Keep the following file paths:
   - content/event-slides.json
   - events-slideshow.js
   - assets/event-slides/kids-christmas-party-dec6-2026.jpg
   - assets/event-slides/wayside-youth-donation-drive-2026.jpg
   - assets/event-slides/wayside-youth-serving-dec21-2026.jpg
5. Click Commit changes directly to main. Cloudflare will deploy automatically.
6. Refresh your church website with Ctrl+F5 and use the slideshow arrows.

IMPORTANT
The new events-slideshow.js retains the three original embedded-image fixes and
also embeds the three new images to prevent missing-picture/black-slide issues.
It updates the slideshow ONLY. It does not change homepage, giving, sermons, or live streams.
If you added MORE slides in Pages CMS since our last 11-slide saved version,
compare or merge your existing content/event-slides.json first to avoid overwriting them.
