import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req) {
  await dbConnect();
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });

    const user = await User.create({ name, email, password, role: role || 'agent' });
    const token = signToken({ id: user._id, name: user.name, email: user.email, role: user.role });

    const res = NextResponse.json({ message: 'Account created', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    res.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' });
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}