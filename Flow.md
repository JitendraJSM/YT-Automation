      [Youtube Automation](https://github.com/Jitendra-Nath-Swami/YouTube-Automation)

Main Tasks:

1.  Increase Subscribers.
2.  Increase Views.
3.  Increase Likes.

- Two Possible Solutions:

  1.  Youtube Automation on the Basis of Puppeteer.
  2.  Youtube Automation whole on the Basis of requests and node-fetch.

  - Firstly trying with Puppeteer as i have more experience with it.

** YT Automation on the Basis of Puppeteer **

# Flow

1. Loop over Each Chrome Profile name it "profilesLoop"

   - const targetProfiles = [8,6,12,5]
   - open profiles one by one and perform actions (subscribers, views, likes)

2. After Opening Profile:
   - const channelUrls = ["channelUrl1", "channelUrl2", "channelUrl3", "channelUrl4", "channelUrl5"]
     \*\*\*\* Channel Url is actually the shorts url of the channel.
   - const videoUrls = ["videoUrl1", "videoUrl2", "videoUrl3", "videoUrl4", "videoUrl5"]
   - const likeUrls = ["likeUrl1", "likeUrl2", "likeUrl3", "likeUrl4", "likeUrl5"]
   - Loop
     - Subscribe Action
       -- Open Channel Url
       -- Click Like
       -- Click Channel Name
       -- Click Subscribe
       -- Agaiin Click subscribe then Click "All"
