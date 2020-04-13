export default function ({isServer, store, redirect, req}) {
  if (store.state.user.isLogin) {
    return
  }
  let user = req.session.user
  if (isServer) {
    if (user && user.role!=1) {
      return store.commit('user/setUser', user)
    } else {
      redirect('/shop/login')
    }
  }
  return store.dispatch('user/checkLogin', user).then(isLogin => {
    if (!isLogin) {
      redirect('/shop/login')
    }
  })
}
