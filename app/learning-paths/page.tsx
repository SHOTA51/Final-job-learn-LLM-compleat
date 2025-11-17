"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Newspaper, TrendingUp, Calendar, Clock, ArrowRight, Search, BookOpen, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function NewsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ userId: string; username: string } | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        }
      } catch (error) {
        // ignore - allow page to render for unauthenticated users
      }
    }

    checkAuth()
  }, [])

  const featuredNews = [
    {
      title: "เปิดรับสมัคร TCAS 69 รอบที่ 1 Portfolio - ตารางสอบสัมภาษณ์ 50 มหาวิทยาลัย",
      description:
        "รวมกำหนดการรับสมัคร TCAS 68 รอบ Portfolio ทุกมหาวิทยาลัย พร้อมเทคนิคการเตรียมตัวสอบสัมภาษณ์และส่ง Portfolio ให้ผ่าน",
      category: "TCAS 68",
      date: "15 พ.ย. 2568",
      readTime: "8 นาที",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dekD-c6RfftBXe1Msg3hGslt0UWx7p5Vb9q.jpg",
      featured: true,
      url: "https://www.dek-d.com/tcas/67532/",
    },
    {
      title: "ข่าวดี! SIIT ม.ธรรมศาสตร์ แจกทุนกว่า 100 ทุน สมัครฟรีทั้ง #dek69 และเด็กซิ่ว!",
      description:
        "สวัสดีค่ะน้องๆ ปฏิเสธไม่ได้ว่าทุกวันนี้หลายๆ คน มองหาทุนการศึกษาสำหรับการเรียนในมหาวิทยาลัย ซึ่งวันนี้พี่แนนนี่ก็มีข่าวคราวเรื่องทุนการศึกษามาฝาก โดยเฉพาะใครที่อยากเรียนกลุ่มคณะวิศวกรรมศาสตร์ ตอนนี้สถาบันเทคโนโลยีนานาชาติสิรินธร (SIIT) กำลังเปิดรับสมัครชิงทุนการศึกษา กว่า 100 ทุน",
      category: "ทุนการศึกษา",
      date: "13 พ.ย. 2567",
      readTime: "6 นาที",
      image: "/scholarship-graduation-celebration.jpg",
      featured: true,
      url: "https://www.dek-d.com/tcas/67039/",
    },
  ]

  const newsArticles = [
    {
      title: "รวบรวม 13 คณะยอดฮิตที่จบมาแล้วมีงานทําแน่นอน ฉบับอัปเดตล่าสุด",
      description:
        "สำหรับใครที่กำลังสงสัยว่าเรียนคณะอะไรดี? ที่จบแล้วมีงานทํา รวมถึงคณะที่เรียนง่ายมีงานทํา บทความนี้จะมายกตัวอย่าง 13 คณะที่จบมาแล้วมีงานทําแน่นอน ทั้งยังเงินเดือนสูงอีกด้วย ดังนี้",
      category: "แนะแนวการเรียน",
      date: "12 พ.ย. 2567",
      readTime: "7 นาที",
      image: "/career-success-office.jpg",
      url: "https://th.jobsdb.com/th/career-advice/article/in-demand-college-majors",
    },
    {
      title: "อยากติดรอบ Portfolio ต้องทำยังไง รวมเทคนิคทำพอร์ตเข้ามหาลัย",
      description:
        "พี่เชื่อว่า คงมีน้อง ๆ หลายคนที่มีความฝันที่อยากจะสอบติดมหาวิทยาลัย ตั้งแต่รอบ 1 (รอบ Portfolio) ใช่ไหมล่ะ !! แต่ติดตรงที่ไม่รู้ว่าควรจะต้องเริ่มต้นทำพอร์ตยังไงดี ? ต้องทำกี่หน้า ? ใส่เอกสารอะไรบ้าง ? ควรเก็บพอร์ตยังไง และควรทำพอร์ตแบบไหน ให้เข้าตาคณะกรรมการ",
      category: "Portfolio",
      date: "10 พ.ย. 2567",
      readTime: "10 นาที",
      image: "/portfolio-design-creative.jpg",
      url: "https://www.smartmathpro.com/article/startportfolio/",
    },
    {
      title: "เรียนปริญญาโท Data Science ดีมั้ย? มาดูข้อดี-ข้อเสียกัน",
      description:
        'ช่วงนี้มีคนถามแอดมาเยอะมากครับว่า "เรียนปอโท Data Science ดีมั้ย" หรือ "เรียนป.โท Data Science มหาลัยไหนดี" ซึ่งคิดว่าเป็นคำถามที่หลาย ๆ คนสงสัย รวมถึงแอดเองด้วยก่อนที่จะไปเรียนต่อครับ',
      category: "รีวิวสาขา",
      date: "8 พ.ย. 2567",
      readTime: "12 นาที",
      image: "/data-science-analytics.jpg",
      url: "https://blog.datath.com/%E0%B8%9B%E0%B8%A3%E0%B8%B4%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B9%82%E0%B8%97-data-science/",
    },
    {
      title: "ข่าวดี! ม.เกษตรฯ เปิดหลักสูตรใหม่ 4 สาขา ด้าน วิศวฯ-คอมฯ-ท่องเที่ยว เปิดรับรอบ Admission นี้",
      description: "ม.เกษตรศาสตร์ เพิ่มจำนวนสาขาที่เปิดรับสมัครในรอบ 3 เพราะมีหลักสูตรที่ได้อนุมัติใหม่เพิ่มขึ้นมา 4 หลักสูตร",
      category: "ข่าวการศึกษา",
      date: "6 พ.ย. 2567",
      readTime: "5 นาที",
      image: "/artificial-intelligence-technology.png",
      url: "https://www.dek-d.com/tcas/62143/",
    },
    {
      title: "Update! การจัดสนามสอบ และวิธีเปลี่ยนสนามสอบ/วิชาสอบ TGAT/TPAT2-5 ใน TCAS69",
      description:
        "สำหรับน้องๆ ที่สมัครสอบ TGAT/TPAT ไปแล้ว และมีคำถามว่าจะเปลี่ยนสนามสอบ เปลี่ยนวิชาสอบได้มั้ย และลำดับการสมัครมีผลต่อการจัดที่นั่งมั้ย พี่มิ้นท์สรุปมาให้แล้วค่ะ",
      category: "GAT/PAT",
      date: "4 พ.ย. 2567",
      readTime: "15 นาที",
      image: "/exam-preparation-studying.jpg",
      url: "https://www.dek-d.com/tcas/67537/",
    },
    {
      title: "ทุนต่อนอกใกล้ฉัน! SCG แจกทุน ป.ตรี & โท ต่างประเทศ พร้อมโอกาสร่วมงานหลังเรียนจบ (SCG New Gen Scholarship 2025)",
      description:
        "ใครที่กำลังมองหาทุนเรียนป.ตรี หรือ ป.โท ทางด้านบริหารธุรกิจ วิทยาศาสตร์และเทคโนโลยี วิศวกรรมศาสตร์ ฯลฯ มามุงกันด่วนๆ เพราะตอนนี้ บริษัทชั้นนำอย่าง 'SCG' กำลังเปิดรับสมัครบุคคลทั่วไปรับทุนภายใต้โครงการ 'SCG New Gen Scholarship' ประจำปี 2568",
      category: "ทุนการศึกษา",
      date: "1 พ.ย. 2567",
      readTime: "6 นาที",
      image: "/international-students-campus.jpg",
      url: "https://www.dek-d.com/studyabroad/66317/",
    },
  ]

  const allItems = [...featuredNews, ...newsArticles]

  const categories = useMemo(() => {
    const s = new Set<string>()
    allItems.forEach((it) => it.category && s.add(it.category))
    return ["ทั้งหมด", ...Array.from(s)]
  }, [allItems])

  const [selectedCategory, setSelectedCategory] = useState<string>("ทั้งหมด")

  const filteredFeatured = selectedCategory === "ทั้งหมด" ? featuredNews : featuredNews.filter((n) => n.category === selectedCategory)
  const filteredArticles = selectedCategory === "ทั้งหมด" ? newsArticles : newsArticles.filter((a) => a.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/chat" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Job & Education Guide</h1>
              <p className="text-xs text-muted-foreground">Your AI Career Assistant</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="ghost">แชท</Button>
            </Link>
            <Link href="/learning-paths">
              <Button variant="ghost" className="bg-accent">
                ข่าวสาร
              </Button>
            </Link>
            {user ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.username}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600 opacity-90" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="w-8 h-8 text-white" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                อัพเดทล่าสุด
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">ข่าวสารการศึกษาและการรับสมัคร</h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 text-pretty">
              ติดตามข่าวสารการรับสมัครเข้ามหาวิทยาลัย ทุนการศึกษา และข้อมูลการศึกษาที่คุณไม่ควรพลาด
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/chat">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2">
                  <Search className="w-5 h-5" />
                  ค้นหาข่าวสาร
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">ข่าวเด่นวันนี้</h3>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm ${selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {filteredFeatured.map((news, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-border overflow-hidden cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={news.image || "/placeholder.svg"}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">{news.category}</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors text-balance">
                  {news.title}
                </CardTitle>
                <CardDescription className="text-pretty">{news.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{news.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{news.readTime}</span>
                    </div>
                  </div>
                  <a href={news.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="gap-2 group-hover:gap-3 transition-all">
                      อ่านต่อ
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Latest News Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">ข่าวล่าสุด</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="group hover:shadow-lg transition-all duration-300 border-border overflow-hidden cursor-pointer h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {article.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2 text-balance">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-pretty">{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs">{article.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary via-purple-600 to-pink-600 border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10" />
            <CardContent className="relative py-12 px-6 md:px-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-balance">ไม่พลาดทุกข่าวสารการศึกษา</h3>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto text-pretty">
                คุยกับ AI Assistant เพื่อรับข้อมูลการรับสมัคร ทุนการศึกษา และคำแนะนำส่วนตัวเกี่ยวกับการศึกษา
              </p>
              <Link href="/chat">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2">
                  เริ่มคุยกับ AI
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
