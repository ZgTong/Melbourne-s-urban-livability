library(tidyverse)
library(ggplot2)
library(reshape2)

data <- read.csv('/Users/tangxuanjin/Desktop/2022-s1/COMP90024-CCC/twitter_harvester/output/weather.csv', header = TRUE)
weather <- read.csv('/Users/tangxuanjin/Desktop/2022-s1/COMP90024-CCC/twitter_harvester/output/weather_past10years.csv', header = TRUE)

df <- merge(data, weather, by = c('date'))

mod <- glm(pos ~ temperature_min + temperature_avg + temperature_max + uv_max 
           + rain_sum + humidity_avg + wind_max + wind_avg, 
           family = poisson, data = df)
summary(mod)
anova(mod, test="Chi")
mod1 <- step(mod, trace = FALSE)
summary(mod1)

logit_mod <- glm(pos/total ~ temperature_min + temperature_avg + temperature_max + uv_max 
                 + rain_sum + humidity_avg + wind_max + wind_avg, 
                 family = binomial, data = df, weight=total)
mod2 <- step(logit_mod, trace = FALSE)
summary(mod2)

res_df <- df %>% select(date, temperature_min, temperature_avg, uv_max, rain_sum, pos, total)
plot_df <- melt(res_df ,  id.vars = 'date', variable.name = 'series')

# plot on same grid, each series colored differently -- 
# good if the series have same scale
ggplot(plot_df, aes(date,value)) + geom_line(aes(colour = series))
ggplot(plot_df, aes(date,value)) + geom_line() + facet_grid(series ~ .)
ggplot(df_wide, aes(x = date, y = val, color = colname, group = 1)) + geom_line()

df_wide <- res_df %>% pivot_longer(c(temperature_min, temperature_avg, uv_max, rain_sum, pos, total), names_to = "colname", values_to = "val")

month_df <- as.data.frame(res_df)
month_df$date <- format(as.Date(month_df$date), "%Y-%m")

agg_by_month <- do.call(data.frame, aggregate(. ~ date,month_df,FUN = function(x){ c(min = min(x), 
                                                                 avg = mean(x),
                                                                 max = max(x),
                                                                 sum = sum(x))}))
agg_by_month <- agg_by_month %>% select(date, temperature_min.min, temperature_avg.avg, uv_max.max, rain_sum.sum,
                                        pos.sum, total.sum)
scaled.dat <- agg_by_month[, -c(1)]
scaled.dat$ratio <- scaled.dat$pos / scaled.dat$total
scaled.dat$pos <- NULL
scaled.dat$total <- NULL
scaled.dat <- as.data.frame(scale(scaled.dat))
scaled.dat$date <- agg_by_month$date
df_wide <- scaled.dat %>% pivot_longer(c(temperature_min.min, temperature_avg.avg, uv_max.max, rain_sum.sum,
                                           pos.sum, total.sum), names_to = "colname", values_to = "val")
colnames(agg_by_month) <- c("date", "temperature_min", "temperature_avg", "uv_max", "rain_sum", "pos", "total")
ggplot(scaled.dat, aes(date)) + 
    geom_line(aes(y = temperature_min, colour = "temperature_min", group=1)) + 
    geom_line(aes(y = ratio, colour = "positive ratio", group=1))
ggplot(scaled.dat, aes(date)) + 
    geom_line(aes(y = temperature_avg, colour = "temperature_avg", group=1)) + 
    geom_line(aes(y = ratio, colour = "positive ratio", group=1))
ggplot(scaled.dat, aes(date)) + 
    geom_line(aes(y = uv_max, colour = "uv_max", group=1)) + 
    geom_line(aes(y = ratio, colour = "positive ratio", group=1))
ggplot(scaled.dat, aes(date)) + 
    geom_line(aes(y = rain_sum, colour = "rain_sum", group=1)) + 
    geom_line(aes(y = ratio, colour = "positive ratio", group=1))

ggplot(scaled.dat, aes(date)) + 
    geom_line(aes(y = rain_sum, colour = "rain_sum", group=1)) + 
    geom_line(aes(y = ratio, colour = "positive ratio", group=1), size = 2) +
    geom_line(aes(y = uv_max, colour = "uv_max", group=1)) +
    geom_line(aes(y = temperature_avg, colour = "temperature_avg", group=1)) +
    geom_line(aes(y = temperature_min, colour = "temperature_min", group=1))
    
    
    
