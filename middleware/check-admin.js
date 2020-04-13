export default function ({isServer, store, redirect, req, env}) {
  if (req) {
    env.baseUrl = "http://"+req.headers.host
  } else {
    env.baseUrl = "http://"+window.location.host
  }
  if (store.state.admin.isLogin) {
    return
  }
  let admin = req.session.admin
  if (isServer) {
    if (admin) {
      return store.commit('admin/setAdmin', admin)
    } else {
      redirect('/admin/login')
    }
  }
  return store.dispatch('admin/checkLogin', admin).then(isLogin => {
    if (!isLogin) {
      redirect('/admin/login')
    }
  })
}
