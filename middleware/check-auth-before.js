
export default function ({isServer, store, redirect, req}) {

  if (store.state.user.isLogin) {
    return redirect('/shop/manager/order/list')
  }
  if (isServer) {
    let user = req.session.user
    if (user && user.role == 0) {
      store.commit('user/setUser', user)
      redirect('/shop/manager/order/list')
    }
  }
}
