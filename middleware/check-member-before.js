
export default function ({isServer, store, redirect, req}) {
  if (store.state.member.isLogin) {
    return redirect('/member/manager/order/list')
  }
  if (isServer) {
    let user = req.session.user
    if (user&& user.role) {
      store.commit('member/setUser', user)
      redirect('/member/manager/order/list')
    }
  }
}
