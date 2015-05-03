#this is seeds file for loading test schools
#into db
ActiveRecord::Base.transaction do
  1.upto(1000) { |i|
    Idea.create!(
      name: Forgery::Name.company_name + i.to_s,
      high_concept_pitch:  Forgery::LoremIpsum.words(5),
      elevator_pitch: Forgery::LoremIpsum.words(15),
      description: Forgery::LoremIpsum.words(100),
      location_list: Forgery::Address.city,
      fund: {balance: 0},
      school_id: [*1..9].sample,
      sections: {
        market: Forgery::LoremIpsum.paragraphs,
        problems: Forgery::LoremIpsum.paragraphs,
        solutions: Forgery::LoremIpsum.paragraphs,
        vision: Forgery::LoremIpsum.paragraphs,
        value_proposition: Forgery::LoremIpsum.paragraphs
      },
      student_id: [*21..80].sample,
      looking_for_team: true,
      rules_accepted: true,
      market_list: Forgery::Name.industry
    )
 }

end