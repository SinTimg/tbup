export default function ({ store, redirect}) {
  if (!store.state.member.isLogin) {
    return redirect('/member/login')
  }
}