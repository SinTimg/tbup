export default function ({isServer, store, redirect, req, env}) {
  if (req) {
    env.baseUrl = "http://"+req.headers.host
  } else {
    env.baseUrl = "http://"+window.location.host
  }

  if (store.state.member.isLogin) {
    return
  }
  let user = req.session.user
  if (isServer) {
    if (user && user.role==1) {
      return store.commit('member/setUser', user)
    } else {
      redirect('/member/login')
    }
  }
  return store.dispatch('member/checkLogin', user).then(isLogin => {
    if (!isLogin) {
      redirect('/member/login')
    }
  })
}
