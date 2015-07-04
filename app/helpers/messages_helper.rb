module MessagesHelper
	def recipients_options
		s = ''
		User.find(current_user.followers_ids.members).each do |user|
		  s << "<option value='#{user.id}' data-img-src='#{user.avatar.url(:avatar)}'>#{user.name}</option>"
		end
		s.html_safe
	end

	def markdownify(content)
		context = {
		:asset_root => "http://a248.e.akamai.net/assets.github.com/images/icons/",
		:base_url   => root_url,
		:gfm => false
		}
		pipeline = HTML::Pipeline.new [
		HTML::Pipeline::MarkdownFilter,
		HTML::Pipeline::SanitizationFilter,
		HTML::Pipeline::EmojiFilter,
		HTML::Pipeline::MentionFilter
		], context
		pipeline.call(content)[:output].to_s.html_safe
	end

	def linkify(content)
		context = {
		:asset_root => "http://a248.e.akamai.net/assets.github.com/images/icons/",
		:base_url   => root_url,
		:gfm => true
		}
		pipeline = HTML::Pipeline.new [
		HTML::Pipeline::MarkdownFilter,
		HTML::Pipeline::SanitizationFilter,
		HTML::Pipeline::EmojiFilter,
		HTML::Pipeline::MentionFilter
		], context

		pipeline.call(content)[:output].to_s.html_safe
	end

	def sanitizify(content)
		context = {
		:asset_root => "http://a248.e.akamai.net/assets.github.com/images/icons/",
		:base_url   => root_url
		}
		pipeline = HTML::Pipeline.new [
		HTML::Pipeline::SanitizationFilter
		], context

		pipeline.call(content)[:output].to_s.html_safe
	end

end
