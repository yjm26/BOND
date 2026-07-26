/**
 * Map wallet / RPC / contract errors to short next-action copy (Emil: clear, not decorative).
 */
export function humanizeTxError(err) {
  const raw = String(err?.reason || err?.shortMessage || err?.message || err || '')
  const lower = raw.toLowerCase()

  if (
    lower.includes('user rejected') ||
    lower.includes('user denied') ||
    lower.includes('denied transaction') ||
    lower.includes('action_rejected') ||
    lower.includes('rejected the request')
  ) {
    return { kind: 'reject', message: 'Signature cancelled.' }
  }

  if (lower.includes('wrong network') || lower.includes('chain mismatch') || lower.includes('Unrecognized chain')) {
    return { kind: 'chain', message: 'Switch wallet to Arc Testnet (chainId 5042002).' }
  }

  if (lower.includes('insufficient funds') || lower.includes('insufficient balance')) {
    return {
      kind: 'balance',
      message: 'Not enough USDC for gas or transfer. Fund Arc Testnet USDC, then retry.',
    }
  }

  if (lower.includes('allowance') || lower.includes('transfer amount exceeds allowance') || lower.includes('erc20: insufficient allowance')) {
    return { kind: 'approve', message: 'USDC approval missing or too low. Approve the exact amount, then retry.' }
  }

  if (lower.includes('fund window expired') || lower.includes('not joinable')) {
    return { kind: 'window', message: 'Fund window closed (30 min after join). Create or join a new room.' }
  }

  if (lower.includes('join window expired') || lower.includes('not open for join')) {
    return { kind: 'window', message: 'Join window closed (1 day after create).' }
  }

  if (lower.includes('delivery deadline') || lower.includes('deadline not passed') || lower.includes('deadline passed')) {
    return { kind: 'deadline', message: 'Outside the delivery window for this action.' }
  }

  if (lower.includes('only buyer') || lower.includes('only seller') || lower.includes('not authorized')) {
    return { kind: 'role', message: 'This wallet cannot run that action on this room.' }
  }

  if (lower.includes('invalid join code')) {
    return { kind: 'join', message: 'Join code does not match this room.' }
  }

  if (lower.includes('max active')) {
    return { kind: 'cap', message: 'Max 3 open rooms for this wallet. Close one first.' }
  }

  if (lower.includes('nonce') && (lower.includes('too low') || lower.includes('already known'))) {
    return { kind: 'nonce', message: 'Wallet nonce stuck. Clear pending activity in the wallet, then retry.' }
  }

  if (lower.includes('execution reverted') || lower.includes('reverted')) {
    const short = raw.replace(/^.*reverted( with reason string)?[:\s]*/i, '').slice(0, 100)
    return {
      kind: 'revert',
      message: short && short !== raw ? short : 'Transaction reverted. Check room state and role.',
    }
  }

  const cleaned = raw.replace(/^Error:\s*/i, '').slice(0, 120)
  return { kind: 'unknown', message: cleaned || 'Transaction failed.' }
}
