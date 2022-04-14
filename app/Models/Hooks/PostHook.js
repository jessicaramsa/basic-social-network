'use strict'

const Logger = use('Logger')

const PostHook = exports = module.exports = {}

PostHook.incrementViews = async (posts) => {
  try {
    const saveView = async (post) => {
      const views = post.views ? parseInt(post.views, 10) : 0
      post.views = views + 1
      await post.save()
    }

    if (Array.isArray(posts)) posts.map(saveView)
    else await saveView(posts)
  } catch(err) {
    Logger.transport('file').error(`PostHook.incrementViews - ${err.stack}`)
    Logger.transport('file').error(err)
  }
}
