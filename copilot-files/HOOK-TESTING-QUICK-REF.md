# 🪝 Hook Testing - Quick Reference

**URL**: http://localhost:5173/?hooks=true

---

## ✅ What You Get

Interactive testing UI for all 11 custom hooks with:
- ✅ Visual loading/error/success states
- ✅ Real-time data fetching
- ✅ Manual refresh buttons
- ✅ Expandable data viewers
- ✅ Auto-fill test IDs
- ✅ Complete documentation

---

## 🚀 Quick Test (3 Steps)

1. **Start app**: `npm run dev`
2. **Open**: http://localhost:5173/?hooks=true
3. **Click**: "Auto-Fill Test IDs" button

Done! Watch all hooks fetch data.

---

## 📁 Files Created

```
✅ src/components/test/HookTestComponent.tsx
✅ src/pages/HookTestPage.tsx
✅ docs/HOOK-TESTING-GUIDE.md
✅ App.tsx (updated with ?hooks=true route)
```

---

## 🪝 Hooks Tested (11)

### Lists (3)
- useJams()
- useMusicians()
- useAllMusic()

### Singles (3)
- useJam(id)
- useMusician(id)
- useMusic(id)

### Related (5)
- useMusicByJam(jamId)
- useRegistrationsByJam(jamId)
- useRegistrationsByMusician(musicianId)
- useScheduleByJam(jamId)
- useScheduleByMusician(musicianId)

---

## 🎯 What to Look For

✅ Green badges with counts = Success  
🔄 Spinners = Loading  
❌ Red alerts = Errors  
📊 Expand "View Data" = See responses  
🔘 "Refresh" buttons = Manual refetch  

---

## 🐛 Common Issues

- Backend not running → Start on localhost:3000
- CORS error → Enable CORS on backend
- No data → Check database has data
- Loading forever → Check backend logs

---

## 📚 Full Guide

See: `docs/HOOK-TESTING-GUIDE.md`

---

**Ready to test!** 🚀

