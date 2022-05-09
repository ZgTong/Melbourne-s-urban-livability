library(tidyverse)
library(ggplot2)
library(reshape2)

data <- read.csv('tweet_harvesting/output/weather_sent.csv', header = TRUE)
weather <- read.csv('tweet_harvesting/output/weather_past10years.csv', header = TRUE)
month_df <- as.data.frame(weather)
month_df$date <- format(as.Date(month_df$date), "%Y-%m")

agg_by_month <- do.call(data.frame, aggregate(. ~ date, month_df,FUN = function(x){ c(min = min(x), 
                                                                 avg = mean(x),
                                                                 max = max(x),
                                                                 sum = sum(x))}))
agg_by_month <- agg_by_month %>% select(date, temperature_min.min, temperature_avg.avg, 
                                        temperature_max.max, uv_max.max, rain_sum.sum,
                                        humidity_avg.avg, wind_max.max, wind_avg.avg)
colnames(agg_by_month) <- c("date", "temperature_min", "temperature_avg", "temperature_max",
                            "uv_max", "rain_sum", "humidity_avg", "wind_max", "wind_avg")
df <- merge(data, agg_by_month, by = c('date'))

mod <- glm(pos ~ .-neg - neu - date - total, 
           family = poisson, data = df)
summary(mod)
anova(mod, test="Chi")
mod1 <- step(mod, trace = FALSE)
summary(mod1)
anova(mod1, test = "Chi")
mod2 <- glm(pos ~ temperature_avg + uv_max + humidity_avg + wind_avg, 
           family = poisson, data = df)

exp(mod2$coef) / sum(exp(mod2$coef))


res_df <- df %>% select(date, temperature_avg, uv_max, humidity_avg, wind_avg, pos, total)

scaled.dat <- res_df[, -c(1)]
scaled.dat$ratio <- scaled.dat$pos / scaled.dat$total
scaled.dat$pos <- NULL
scaled.dat$total <- NULL
scaled.dat <- sapply(scaled.dat, function(x) (x - min(x, na.rm = T)) / (max(x, na.rm = T) - min(x, na.rm=T)))
scaled.dat <- as.data.frame(scaled.dat)
scaled.dat$date <- df$date

p_1 <- ggplot(scaled.dat, aes(date)) + 
    geom_line(aes(y = temperature_avg, colour = "Avg. temperature", group=1)) + 
    geom_line(aes(y = ratio, colour = "Positive ratio", group=1)) +
    theme(axis.text.x = element_text(angle = 90, vjust = 0.5, hjust=1, size=4)) +
    ggtitle("Relationship between Positive Tweets and Average Temperature") +
    xlab("Month") + ylab("Avg. temp/Pos ratio")
png("tweet_harvesting/output/weather_figures/tempavg_vs_ratio.png", 
        width = 7, height = 3, units = "in", res = 1200)
print(p_1)
dev.off()

p_2 <- ggplot(scaled.dat, aes(date)) + 
    geom_line(aes(y = wind_avg, colour = "Avg. wind", group=1)) + 
    geom_line(aes(y = ratio, colour = "Positive ratio", group=1)) +
    theme(axis.text.x = element_text(angle = 90, vjust = 0.5, hjust=1, size=4)) +
    ggtitle("Relationship between Positive Tweets and Average Wind") +
    xlab("Month") + ylab("Avg. wind/Pos ratio")
png("tweet_harvesting/output/weather_figures/windavg_vs_ratio.png", 
        width = 7, height = 3, units = "in", res = 1200)
print(p_2)
dev.off()

p_3 <- ggplot(scaled.dat, aes(date)) + 
    geom_line(aes(y = uv_max, colour = "Max UV", group=1)) + 
    geom_line(aes(y = ratio, colour = "Positive ratio", group=1)) +
    theme(axis.text.x = element_text(angle = 90, vjust = 0.5, hjust=1, size=4)) +
    ggtitle("Relationship between Positive Tweets and Maximum UV") +
    xlab("Month") + ylab("Max UV/pos ratio")
png("tweet_harvesting/output/weather_figures/uvmax_vs_ratio.png", 
        width = 7, height = 3, units = "in", res = 1200)
print(p_3)
dev.off()

p_4 <- ggplot(scaled.dat, aes(date)) + 
    geom_line(aes(y = humidity_avg, colour = "Avg. humidity", group=1)) + 
    geom_line(aes(y = ratio, colour = "Positive ratio", group=1)) + 
    theme(axis.text.x = element_text(angle = 90, vjust = 0.5, hjust=1, size=4)) +
    ggtitle("Relationship between Positive Tweets and Average Humidity") +
    xlab("Month") + ylab("Avg. humidity/Pos ratio")
png("tweet_harvesting/output/weather_figures/humidityavg_vs_ratio.png", 
        width = 7, height = 3, units = "in", res = 1200)
print(p_4)
dev.off()

p_5 <- ggplot(scaled.dat, aes(date)) + 
    geom_line(aes(y = wind_avg, colour = "Avg. wind", group=1)) + 
    geom_line(aes(y = ratio, colour = "Positive ratio", group=1), size = 1) +
    geom_line(aes(y = uv_max, colour = "Max UV", group=1)) +
    geom_line(aes(y = temperature_avg, colour = "Avg. temperature", group=1)) +
    geom_line(aes(y = humidity_avg, colour = "Avg. humidity", group=1)) +
    theme(axis.text.x = element_text(angle = 90, vjust = 0.5, hjust=1, size=4)) +
    ggtitle("Relationship between Positive tweets and All Variables") +
    xlab("Month") + ylab("Overall/Pos ratio")
png("tweet_harvesting/output/weather_figures/overall_vs_ratio.png", 
        width = 7, height = 3, units = "in", res = 1200)
print(p_5)
dev.off()
    
